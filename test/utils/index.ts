import { getConnection } from 'typeorm';

export const cleanDatabase: () => Promise<void> = async () => {
  const connection = getConnection();
  await connection.dropDatabase();
  await connection.synchronize();
};
