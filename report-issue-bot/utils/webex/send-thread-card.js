import fetch from 'node-fetch';
import threadCard from '../cards/threadCard.json' assert { type: 'json' };
import handleResponse from '../handle-response.js';

function sendThreadCard(roomId, parentId, deviceId, actorId) {
  if (deviceId != null) {
    console.log('deviceId', deviceId);
    threadCard.actions[0].data.deviceId = deviceId;
    threadCard.actions[1].card.actions[0].data.deviceId = deviceId;
  }
  if (actorId != null) {
    console.log('actorId', actorId);
    threadCard.actions[0].data.actorId = actorId;
    threadCard.actions[1].card.actions[0].data.actorId = actorId;
  }
  const body = {
    roomId: roomId,
    parentId: parentId,
    text: 'hi',
    attachments: [
      {
        contentType: 'application/vnd.microsoft.card.adaptive',
        content: threadCard
      }
    ]
  };
  return fetch(process.env.WEBEX_API_URL + '/messages', {
    headers: {
      'Authorization': 'Bearer ' + process.env.WEBEX_ACCESS_TOKEN,
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(body)
  })
    .then((r) => handleResponse(r))
    .then((r) => r.json())
    .catch((e) => console.log('error', e));
}

export default sendThreadCard;
