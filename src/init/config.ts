import dotenv from 'dotenv';

// Load the values from the environment
const { error } = dotenv.config();
if (error) {
  console.error(`Failed to load environment variables: ${error}`);
  process.exit(1);
} else {
  console.debug('Loaded environment variables from .env');
}

// Put the values in a nicely structured object.
// Exits the process if a required variable is not found.

function getValueOrExit(key: string): string {
  const maybeValue = process.env[key];
  if (maybeValue === undefined) {
    console.error(`Missing required config variable '${key}'`);
    process.exit(1);
  }
  return maybeValue;
}

type Environment = 'production' | 'development' | 'test';
interface Config {
  environment: Environment;
  port: string;
  databaseUrl: string;
}

let environment: Environment;
let databaseUrl: string;

switch (process.env.NODE_ENV) {
  case 'production':
    environment = 'production';
    databaseUrl = getValueOrExit('PROD_DATABASE_URL');
    break;
  case 'test':
    environment = 'test';
    databaseUrl = getValueOrExit('TEST_DATABASE_URL');
    break;
  default:
    environment = 'development';
    databaseUrl = getValueOrExit('DEV_DATABASE_URL');
    break;
}

const port = getValueOrExit('PORT');

const config: Config = {
  environment,
  port,
  databaseUrl,
};

console.log('Loaded configuration', config);

export default config;
