import fetch from 'node-fetch';
import messageCard from '../cards/messageCard.json' assert { type: 'json' };
import handleResponse from '../handle-response.js';

function sendMessageCard(roomId, parentId, deviceId, actorId) {
  if (deviceId != null) {
    messageCard.actions[0].data.deviceId = deviceId;
  }
  if (actorId != null) {
    messageCard.actions[0].data.actorId = actorId;
  }
  const body = {
    roomId: roomId,
    parentId: parentId,
    text: 'hi',
    attachments: [
      {
        contentType: 'application/vnd.microsoft.card.adaptive',
        content: messageCard
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

export default sendMessageCard;
