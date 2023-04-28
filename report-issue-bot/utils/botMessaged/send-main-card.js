import mainCard from '../cards/directCard.json' assert { type: 'json' };
import mongoClient from '../MongoDB/db.js';
import { mongoDB, typeCol } from '../MongoDB/db.js';
import webex from 'webex/env.js';

async function sendMainCard(roomId) {
  //   console.log('in main card', roomId);
  //   let engagementTypes = [];
  //   await mongoClient
  //     .db(mongoDB)
  //     .collection(typeCol)
  //     .find()
  //     .toArray(function (err, documents) {
  //       console.log('got engagementTypes');
  //       if (err) {
  //         console.log('error in getting docs', err);
  //       }
  //       for (let doc of documents) {
  //         engagementTypes.push({ title: doc.room_name, value: doc.room_name });
  //       }
  //       mainCard.body[2].choices = engagementTypes;
  //       mainCard.body[2].value = engagementTypes[0]['value']; //preselect first item as value.  remove this line to default to --select-- placeholder in JSON card.
  //       let payload = {
  //         roomId: roomId,
  //         markdown: 'Issue Request Form - Adaptive Card'
  //       };
  //       if (mainCard !== undefined) {
  //         payload.attachments = [
  //           {
  //             contentType: 'application/vnd.microsoft.card.adaptive',
  //             content: mainCard
  //           }
  //         ];
  //       }
  //       webex.messages.create(payload).catch((err) => {
  //         console.log(`error sending message card: ${err}`);
  //       });
  //     });

  console.log('in main card', roomId);
  let engagementTypes = [];
  let cursor = await mongoClient.db(mongoDB).collection(typeCol).find();
  console.log(cursor.count());
  let doc;
  while (await cursor.hasNext()) {
    doc = await cursor.next();
    console.log('doc:', doc);
    engagementTypes.push({ title: doc.room_name, value: doc.room_name });
  }
  mainCard.body[2].choices = engagementTypes;
  mainCard.body[2].value = engagementTypes[0]['value']; //preselect first item as value.  remove this line to default to --select-- placeholder in JSON card.
  let payload = {
    roomId: roomId,
    markdown: 'Issue Request Form - Adaptive Card'
  };
  if (mainCard !== undefined) {
    payload.attachments = [
      {
        contentType: 'application/vnd.microsoft.card.adaptive',
        content: mainCard
      }
    ];
  }
  webex.messages.create(payload).catch((err) => {
    console.log(`error sending message card: ${err}`);
  });
}

export default sendMainCard;
