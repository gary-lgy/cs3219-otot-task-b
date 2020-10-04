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
interface Config {
  environment: 'production' | 'development';
  port: string;
  databaseUrl: string;
}

const config: Config = {
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  port: getValueOrExit('PORT'),
  databaseUrl: getValueOrExit('DATABASE_URL'),
};

export default config;
