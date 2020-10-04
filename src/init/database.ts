import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import config from './config';

// pgcli postgres://gary:@localhost:5432/cs3219-otot-task-b
export const setupDatabase = async (): Promise<Connection> => {
  try {
    const options: ConnectionOptions = {
      type: 'postgres',
      url: config.databaseUrl,
      synchronize: true,
      logging: true,
      entities: ['dist/entity/**.js'],
    };
    const connection = await createConnection(options);
    console.log('Successfully connected to the database');
    return connection;
  } catch (err) {
    console.error(`Failed to get connection: ${err}`);
    // process.exit(1);
    throw err;
  }
};
