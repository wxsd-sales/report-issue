import mainCard from '../cards/directCard.json' assert { type: 'json' };
import webex from 'webex/env.js';

async function sendMainCard(roomId) {


  console.log('in main card', roomId);
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
