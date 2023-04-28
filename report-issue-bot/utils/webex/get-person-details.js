import fetch from 'node-fetch';
import handleResponse from '../handle-response.js';

function getPersonDetails(personId) {
  return fetch(process.env.WEBEX_API_URL + '/people/' + personId, {
    headers: {
      'Authorization': 'Bearer ' + process.env.WEBEX_ACCESS_TOKEN,
      'Content-Type': 'application/json'
    },
    method: 'GET'
  })
    .then((r) => handleResponse(r))
    .then((r) => r.json())
    .catch((e) => console.log('error', e));
}

export default getPersonDetails;
