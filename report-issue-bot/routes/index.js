import express from 'express';
import mongoClient from '../utils/MongoDB/db.js';
import getRoomID from '../utils/webex/get-room-id.js';
import sendSpaceMessage from '../utils/webex/send-space-message.js';
import sendThreadCard from '../utils/webex/send-thread-card.js';
import webex from 'webex/env.js';
import sendMessageCard from '../utils/webex/send-message-card.js';
import sendWebexMessage from '../utils/webex/send-webex-message.js';
import sendDeviceMessage from '../utils/webex/send-device-message.js';
import getPersonDetails from '../utils/webex/get-person-details.js';
import getParentId from '../utils/webex/get-parentId.js';
import directMessageBot from '../utils/botMessaged/direct-message-bot.js';

const router = express.Router();
var assigned = null;
var messageSend = null;

router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//mongo client connection
mongoClient.connect((err) => {
  if (!err) {
    console.log('mongo connection established.');
  } else {
    console.error('Error while trying to connect to MongoDB');
  }
});

directMessageBot();

webex.attachmentActions.listen().then(() => {
  console.log('listening to attachmentAction events');
  webex.attachmentActions.on('created', async (attachmentAction) => {
    console.log('------------------------------------------------');
    console.log('attachmentAction created event:');
    console.log(attachmentAction);
    let inputs = attachmentAction.data.inputs;
    let roomId = attachmentAction.data.roomId;
    let messageId = attachmentAction.data.messageId;

    if (inputs.assign == 'assign') {
      //from the thread card, if the user clicks on assign to me
      let parentId = await getParentId(messageId).then((r) => r.toString());
      console.log('parentId', parentId);
      assigned = 'assigned';
      webex.messages.remove(messageId);
      await getPersonDetails(attachmentAction.data.personId)
        .then((r) => r.displayName)
        .then((r) => sendWebexMessage(roomId, parentId, `Request has been accepted by ${r}`));
      let cardmessageId = sendMessageCard(roomId, parentId, inputs.deviceId, inputs.actorId).then((r) => r.id);
      if (inputs.deviceId != null) {
        sendDeviceMessage('Your request has been accepted', inputs.deviceId, 'Update!').then(() =>
          console.log('Request Update Sent Succesfully')
        );
      }
      if (inputs.actorId != null) {
        sendWebexMessage(inputs.actorId, null, 'Update! Your request has been accepted!');
      }
      messageSend = 'started';
      //if didnot send message within 5 min
      setTimeout(() => {
        if (messageSend == 'started') {
          console.log('messageSend is still null');
          cardmessageId.then((messageId) => webex.messages.remove(messageId));
          sendWebexMessage(roomId, parentId, 'Deleted the request because it has not been accepted for a long time');

          if (inputs.deviceId != null) {
            sendDeviceMessage(
              'Your request has not been answered, please try again later!',
              inputs.deviceId,
              'Update!'
            ).then(() => console.log('Request Update Sent Succesfully'));
          }
          if (inputs.actorId != null) {
            sendWebexMessage(roomId, null, 'Update! Your request has not been answered, please try again later!');
          }
        }
      }, 300000);
    } else if (inputs.delete == 'delete') {
      //from the thread card, if the user clicks on delete
      let parentId = await getParentId(messageId).then((r) => r.toString());
      console.log('parentId', parentId);
      webex.messages.remove(messageId);
      webex.messages.remove(parentId);
      if (inputs.deviceId != null) {
        sendDeviceMessage('Your request has been declined', inputs.deviceId, 'Update!').then(() =>
          console.log('Request Update Sent Succesfully')
        );
      }
      if (inputs.actorId != null) {
        sendWebexMessage(inputs.actorId, null, 'Update! Your request has been declined!');
      }
    } else if (inputs.send == 'main') {
      //from the message card, if the user clicks on send message
      let parentId = await getParentId(messageId).then((r) => r.toString());
      console.log('parentId', parentId);
      webex.messages.remove(messageId);
      await getPersonDetails(attachmentAction.data.personId)
        .then((r) => r.displayName)
        .then((r) =>
          sendWebexMessage(roomId, parentId, `Message has been Sent by ${r} \nMessage: "${inputs.comment}"`)
        );

      if (inputs.deviceId != null) {
        sendDeviceMessage(inputs.comment, inputs.deviceId, 'You got a message!').then(() =>
          console.log('Message Sent Succesfully')
        );
      }
      if (inputs.actorId != null) {
        sendWebexMessage(inputs.actorId, null, `You got a message! \nMessage: "${inputs.comment}"`);
      }
      messageSend = 'sent';
    } else if (inputs.submit == 'main') {
      //from the main card, if the user clicks on submit

      let roomID = await getRoomID(inputs.category);
      let threadInfo = sendSpaceMessage(roomID, inputs)
        .then((r) => sendThreadCard(roomID, r, null, roomId))
        .then((r) => r);
      let parentId = threadInfo.then((r) => r.parentId);
      let threadId = threadInfo.then((r) => r.id);
      webex.messages.remove(messageId);
      sendWebexMessage(roomId, null, 'Success! Feedback Sent. Please wait for an agent to respond!');

      //if didnot accept the request within 5 min
      setTimeout(() => {
        if (assigned == null) {
          console.log('assigned is still null');
          threadId.then((threadId) => webex.messages.remove(threadId));
          parentId.then((parentId) =>
            sendWebexMessage(roomID, parentId, 'Deleted the request because it has not been accepted for a long time')
          );
          sendWebexMessage(roomId, null, 'Update! Your request has not been answered, please try again later!');
          // sendDeviceMessage(
          //   'Your request has not been answered, please try again later!',
          //   req.body.identification.deviceId,
          //   'Update!'
          // ).then(() => console.log('Request Update Sent Succesfully'));
        }
      }, 300000);
    }
  });
});
webex.attachmentActions.stopListening();
webex.attachmentActions.off('created');

//post request
router.post('/report-issue-bot-request', async function (req, res) {
  assigned = null;
  console.info(new Date().toUTCString(), req.body);
  let roomID = await getRoomID(req.body.category);
  let threadInfo = sendSpaceMessage(roomID, req.body)
    .then((r) => sendThreadCard(roomID, r, req.body.identification.deviceId))
    .then((r) => r);
  let parentId = threadInfo.then((r) => r.parentId);
  let threadId = threadInfo.then((r) => r.id);

  //if didnot accept the request within 5 min
  setTimeout(() => {
    console.log('assigned in router post set time out', assigned);
    if (assigned == null) {
      console.log('assigned is still null');
      threadId.then((threadId) => webex.messages.remove(threadId));
      parentId.then((parentId) =>
        sendWebexMessage(roomID, parentId, 'Deleted the request because it has not been accepted for a long time')
      );
      sendDeviceMessage(
        'Your request has not been answered, please try again later!',
        req.body.identification.deviceId,
        'Update!'
      ).then(() => console.log('Request Update Sent Succesfully'));
    }
  }, 300000);
  //sedn response back
  if (roomID) {
    res.json({ roomID });
  } else {
    res.status(500);
  }
});

export default router;
