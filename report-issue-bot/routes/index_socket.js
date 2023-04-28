//same one with socket io connection instead of post
//saving for future use if required

import express from 'express';
import * as http from 'http';
import { WebSocketServer } from 'ws';
import mongoClient from '../utils/MongoDB/db.js';
import getRoomID from '../utils/webex/get-room-id.js';
import sendSpaceMessage from '../utils/webex/send-space-message.js';
import sendThreadCard from '../utils/webex/send-thread-card.js';
import webex from 'webex/env.js';
import sendMessageCard from '../utils/webex/send-message-card.js';
import sendWebexMessage from '../utils/webex/send-webex-message.js';

const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ server: server });

mongoClient.connect((err) => {
  if (!err) {
    console.log('mongo connection established.');
  } else {
    console.error('Error while trying to connect to MongoDB');
  }
});

wss.on('connection', function connection(ws) {
  console.log('A new client Connected!');
  ws.send('Welcome New Client!');

  ws.on('message', async function incoming(message) {
    message = JSON.parse(message);
    console.log('received: ', message);
    console.log('mongo db connecting...');
    let comments = '';
    let roomID = await getRoomID(message.issue_type);
    console.log('roomID', roomID);
    let parentId = sendSpaceMessage(roomID, message)
      .then((r) => sendThreadCard(roomID, r))
      .then((r) => r.parentId);

    parentId.then((parentId) => {
      webex.attachmentActions.listen().then((action) => {
        console.log('listening to attachmentAction events');
        console.log('action', action);
        webex.attachmentActions.on('created', (attachmentAction) => {
          console.log('------------------------------------------------');
          console.log('attachmentAction created event:');
          console.log(attachmentAction);
          let inputs = attachmentAction.data.inputs;
          let messageId = attachmentAction.data.messageId;
          if (inputs.assign == 'assign') {
            webex.messages.remove(messageId);
            sendMessageCard(roomID, parentId).then((r) => console.log(r));
          } else if (inputs.delete == 'delete') {
            webex.messages.remove(messageId);
            webex.messages.remove(parentId);
          } else if (inputs.send == 'main') {
            webex.messages.remove(messageId);
            sendWebexMessage(roomID, parentId);
            comments = inputs.comment;
            ws.send(comments);
          }
        });
      });
      webex.attachmentActions.stopListening();
      webex.attachmentActions.off('created');
    });

    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

app.get('/', (req, res) => res.send('Hello World!'));

server.listen(3000, () => console.log(`Lisening on port :3000`));
