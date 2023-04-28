/* IMPORTS */
import { MongoClient } from 'mongodb';
import { config } from 'dotenv';

config();

/* RUNTIME VARS */
console.log(process.env.MONGO_URI);
const mongoUri = `${process.env.MONGO_URI}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
const mongoClient = new MongoClient(mongoUri);
const mongoDB = process.env.MONGO_DB;
const typeCol = 'rooms';

/* EXPORTS */

export default mongoClient;
export { mongoDB, typeCol };
