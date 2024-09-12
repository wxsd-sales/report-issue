import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import 'dotenv/config';
import indexRouter from './routes/index.js';

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get("/about", function (req, res) {
    res.send("About this wiki");
  });
app.use('/', indexRouter);

// module.exports = app;
export default app;
