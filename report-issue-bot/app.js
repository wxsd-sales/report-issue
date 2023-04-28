import express from 'express';
import logger from 'morgan';
import cors from 'cors';

import indexRouter from './routes/index.js';

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);

// module.exports = app;
export default app;
