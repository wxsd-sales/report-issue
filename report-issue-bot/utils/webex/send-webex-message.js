import fetch from 'node-fetch';
import handleResponse from '../handle-response.js';

function sendWebexMessage(roomId, parentId, message) {
  const body = {
    roomId: roomId,
    parentId: parentId,
    text: message
  };
  if (parentId != null) {
    body.parentId = parentId;
  }
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

export default sendWebexMessage;
