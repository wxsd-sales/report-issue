import fetch from 'node-fetch';
import mainCard from '../cards/main.json' assert { type: 'json' };
import handleResponse from '../handle-response.js';

function sendSpaceMessage(roomId, message) {
  if (message.name != null) {
    mainCard.body[8].text = 'Reporters Name:';
    mainCard.body[9].text = message.name;
  } else if (message.name == null) {
    mainCard.body[8].text = '';
    mainCard.body[9].text = '';
  }
  mainCard.body[5].text = message.category;
  if (message.description != null) {
    mainCard.body[6].text = 'Description:';
    mainCard.body[7].text = message.description;
  } else if (message.description == null) {
    mainCard.body[6].text = '';
    mainCard.body[7].text = '';
  }
  const body = {
    roomId: roomId,
    text: 'hi',
    attachments: [
      {
        contentType: 'application/vnd.microsoft.card.adaptive',
        content: mainCard
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
    .then((r) => r.id)
    .catch((e) => console.log('error', e));
}

export default sendSpaceMessage;
