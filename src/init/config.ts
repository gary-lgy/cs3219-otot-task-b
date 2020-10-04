import dotenv from 'dotenv';

type Environment = 'production' | 'development' | 'test';
const environment: Environment =
  process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test'
    ? process.env.NODE_ENV
    : 'development';

// For development, load the values from .env
if (environment === 'development') {
  const { error } = dotenv.config();
  if (error) {
    throw new Error(`Failed to load environment variables: ${error}`);
  } else {
    console.debug('Loaded environment variables from .env');
  }
}

// Put the values in a nicely structured object.
// Exits the process if a required variable is not found.

function getValueOrExit(key: string): string {
  const maybeValue = process.env[key];
  if (maybeValue === undefined) {
    throw new Error(`Missing required config variable '${key}'`);
  }
  return maybeValue;
}

interface Config {
  environment: Environment;
  port: string;
  databaseUrl: string;
}

let databaseUrl: string;

switch (environment) {
  case 'production':
    databaseUrl = getValueOrExit('PROD_DATABASE_URL');
    break;
  case 'test':
    databaseUrl = getValueOrExit('TEST_DATABASE_URL');
    break;
  default:
    databaseUrl = getValueOrExit('DEV_DATABASE_URL');
    break;
}

const port = getValueOrExit('PORT');

const config: Config = {
  environment,
  port,
  databaseUrl,
};

export default config;
