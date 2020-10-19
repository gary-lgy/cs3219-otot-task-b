import bodyParser from 'body-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import 'reflect-metadata';
import * as debugController from './controller/DebugController';
import * as quoteController from './controller/QuoteController';
import config from './init/config';

// create express app
const app = express();

app.use(bodyParser.json());
app.use(cors());

if (config.environment === 'production') {
  app.use(morgan('combined'));
} else if (config.environment === 'development') {
  app.use(morgan('dev'));
}

const apiRouter = express.Router();
app.use('/api/', apiRouter);

const apiV1Router = express.Router();
apiRouter.use('/v1', apiV1Router);

const quoteRouter = express.Router();
apiV1Router.use('/quotes', quoteRouter);

quoteRouter.get('/', quoteController.getQuotes);
quoteRouter.get('/:id', quoteController.getQuote);
quoteRouter.post('/', quoteController.createQuote);
quoteRouter.put('/:id', quoteController.editQuote);
quoteRouter.delete('/:id', quoteController.deleteQuote);

const debugRouter = express.Router();
apiV1Router.use('/debug', debugRouter);
debugRouter.post('/', debugController.createSampleQuotes);

// Error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('unhandled error', error);
  return res.status(500).json({ message: 'internal server error' });
});

export default app;
