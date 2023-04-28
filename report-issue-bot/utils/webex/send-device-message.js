import fetch from 'node-fetch';
import handleResponse from '../handle-response.js';

function sendDeviceMessage(message, deviceId, title) {
  const body = {
    deviceId: deviceId,
    arguments: {
      Duration: 30,
      Title: title,
      Text: message
    }
  };
  console.log('body from sendDeviceMessage', body);
  return fetch(process.env.WEBEX_API_URL + '/xapi/command/UserInterface.Message.Alert.Display', {
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

export default sendDeviceMessage;
