import fetch from 'node-fetch';
import newIssueCard from '../cards/newIssueCard.json' assert { type: 'json' };
import handleResponse from '../handle-response.js';

function cardRow(title, text) {
  return [
    {
      type: 'TextBlock',
      text: title + ':',
      weight: 'Bolder',
      wrap: true
    },
    {
      type: 'TextBlock',
      spacing: 'None',
      text: text,
      isSubtle: true,
      wrap: true
    }
  ];
}

function sendNewIssueCard(roomId, issue) {
  const location = issue?.identification?.contactInfoName;
  const issueType = issue?.category;
  const username = issue?.name;
  const deviceNumber = issue?.identification?.contactNumber;
  const deviceProductType = issue?.identification?.ProductId;
  const deviceSerial = issue?.identification?.SerialNumber;
  const deviceSoftwareVersion = issue?.identification?.software;

  if (location) newIssueCard.body.push(...cardRow('Location', location));
  if (issueType) newIssueCard.body.push(...cardRow('Issue Type', issueType));
  if (username) newIssueCard.body.push(...cardRow('Reporter Name', username));
  if (deviceNumber) newIssueCard.body.push(...cardRow('Devices Number', `[${deviceNumber}](tel:${deviceNumber})`));
  if (deviceProductType) newIssueCard.body.push(...cardRow('Devices Product Type', deviceProductType));
  if (deviceSerial) newIssueCard.body.push(...cardRow('Devices Serial', deviceSerial));
  if (deviceSoftwareVersion) newIssueCard.body.push(...cardRow('Devices Software Version', deviceSoftwareVersion));
  
  const body = {
    roomId: roomId,
    text: 'New Issue Adaptive Card',
    attachments: [
      {
        contentType: 'application/vnd.microsoft.card.adaptive',
        content: newIssueCard
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

export default sendNewIssueCard;
