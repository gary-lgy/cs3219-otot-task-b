import serverless from 'serverless-http';
import { getConnection } from 'typeorm';
import app from './app';
import { setupDatabase } from './init/database';

const appLambda = serverless(app);

const ensureDatabaseConnection = async () => {
  try {
    getConnection();
    console.log('Reusing old database connection');
  } catch (err) {
    console.log('Creating new database connection');
    await setupDatabase();
  }
};

export const handler: serverless.Handler = async (event, context) => {
  // Make sure we have a database connection
  await ensureDatabaseConnection();

  // Handle the event
  const result = await appLambda(event, context);

  return result;
};
