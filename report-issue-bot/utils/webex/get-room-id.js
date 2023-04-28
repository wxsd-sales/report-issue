import mongoClient, { mongoDB, typeCol } from '../MongoDB/db.js';

async function getRoomID(roomName) {
  let cursor = await mongoClient
    .db(mongoDB)
    .collection(typeCol)
    .aggregate([{ $match: { room_name: roomName } }]);
  let doc;
  if (await cursor.hasNext()) {
    doc = await cursor.next();
    console.log('doc:');
    console.log(doc);
    return doc.room_id;
  }
}

export default getRoomID;
