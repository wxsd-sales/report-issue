import webex from 'webex/env.js';
import sendMainCard from './send-main-card.js';
function directMessageBot() {
  var botId;
  var botEmail;
  webex.people
    .get('me')
    .then(function (person) {
      botId = person.id;
      botEmail = person.emails[0];
      console.log(`Saving BotId:${botId}`);
    })
    .catch(function (reason) {
      console.error(reason);
      process.exit(1);
    });
  console.log('connected');
  webex.messages
    .listen()
    .then(() => {
      console.log('listening to message events');
      webex.messages.on('created', (message) => {
        if (message.actorId != botId) {
          console.log('message created event:');
          console.log(message);
          let roomId = message.data.roomId;
          console.log(message.data);
          sendMainCard(roomId);
        } //else, we do nothing when we see thex bot's own message
      });
    })
    .catch((err) => {
      console.error(`error listening to messages: ${err}`);
    });
}
export default directMessageBot;
