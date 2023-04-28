import fetch from 'node-fetch';
import handleResponse from '../handle-response.js';

function getParentId(messageId) {
  return fetch(process.env.WEBEX_API_URL + '/messages/' + messageId, {
    headers: {
      'Authorization': 'Bearer ' + process.env.WEBEX_ACCESS_TOKEN,
      'Content-Type': 'application/json'
    },
    method: 'GET'
  })
    .then((r) => handleResponse(r))
    .then((r) => r.json())
    .then((r) => r.parentId)
    .catch((e) => console.log('error', e));
}

export default getParentId;
