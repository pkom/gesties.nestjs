import { Connection, createConnection, ConnectionOptions } from 'typeorm';

import { configService } from '../../../config/config.service.rayuela';

export async function getConnection(): Promise<Connection> {
  const opt = {
    ...configService.getTypeOrmConfig(),
    logging: 'error',
  };
  return await createConnection(opt as ConnectionOptions);
}
