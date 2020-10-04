import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import config from './config';

export const setupDatabase = async (): Promise<Connection> => {
  const isTesting = config.environment === 'test';
  const entities = isTesting ? ['src/entity/**/*.ts'] : ['dist/entity/**/*.js'];
  const logging = !isTesting;
  const options: ConnectionOptions = {
    type: 'postgres',
    url: config.databaseUrl,
    synchronize: true,
    logging,
    entities,
  };
  const connection = await createConnection(options);
  return connection;
};
