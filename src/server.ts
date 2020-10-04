import app from './app';
import config from './init/config';
import { setupDatabase } from './init/database';

// start express server
(async () => {
  try {
    await setupDatabase();
    console.log('Successfully connected to the database');
    app.listen(config.port, () => {
      console.info(
        `App is running at http://localhost:${config.port} in ${config.environment} mode`,
      );
    });
  } catch (err) {
    console.error('Failed to connect to database', err);
  }
})();
