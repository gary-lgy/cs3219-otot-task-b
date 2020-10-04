import bodyParser from 'body-parser';
import express, { NextFunction, Request, Response } from 'express';
import http from 'http';
import morgan from 'morgan';
import 'reflect-metadata';
import * as quoteController from './controller/QuoteController';
import config from './init/config';
import { setupDatabase } from './init/database';

setupDatabase()
  .then(() => {
    // create express app
    const app = express();
    app.use(bodyParser.json());
    if (config.environment === 'production') {
      app.use(morgan('combined'));
    } else {
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

    // Error handler
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
      console.error('unhandled error', error);
      return res.status(500).json({ message: 'internal server error' });
    });

    // start express server
    const server = http.createServer(app);
    server.listen(config.port, () => {
      console.info(`App is running at http://localhost:${config.port} in ${config.environment} mode`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
