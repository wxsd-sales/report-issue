import fetch from 'node-fetch';
import acceptIssueCard from '../cards/acceptIssueCard.json' assert { type: 'json' };
import handleResponse from '../handle-response.js';

function sendAcceptIssueCard(roomId, parentId, deviceId, actorId) {
  if (deviceId != null) {
    console.log('deviceId', deviceId);
    acceptIssueCard.actions[0].data.deviceId = deviceId;
    acceptIssueCard.actions[1].card.actions[0].data.deviceId = deviceId;
  }
  if (actorId != null) {
    console.log('actorId', actorId);
    acceptIssueCard.actions[0].data.actorId = actorId;
    acceptIssueCard.actions[1].card.actions[0].data.actorId = actorId;
  }
  const body = {
    roomId: roomId,
    parentId: parentId,
    text: 'Accept Issue Adaptive Card',
    attachments: [
      {
        contentType: 'application/vnd.microsoft.card.adaptive',
        content: acceptIssueCard
      }
    ]
  };
  console.log('accept issue body', body)
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

export default sendAcceptIssueCard;
