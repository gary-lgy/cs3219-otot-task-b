import dotenv from 'dotenv';

// Try to load the values from .env
dotenv.config();

function getValueFromEnv(key: string): string {
  const maybeValue = process.env[key];
  if (maybeValue === undefined) {
    throw new Error(`Missing required config variable '${key}'`);
  }
  return maybeValue;
}

// Put the values in a nicely structured object.
type Environment = 'production' | 'development' | 'test';
interface Config {
  environment: Environment;
  port?: string;
  databaseUrl: string;
}

let environment: Environment;
let port: string | undefined = undefined;
let databaseUrl: string;

switch (process.env.NODE_ENV) {
  case 'production':
    environment = 'production';
    databaseUrl = getValueFromEnv('PROD_DATABASE_URL');
    break;
  case 'test':
    environment = 'test';
    databaseUrl = getValueFromEnv('TEST_DATABASE_URL');
    break;
  default:
    environment = 'development';
    port = getValueFromEnv('PORT');
    databaseUrl = getValueFromEnv('DEV_DATABASE_URL');
    break;
}

const config: Config = {
  environment,
  port,
  databaseUrl,
};

export default config;
