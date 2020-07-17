import { join } from 'path';

import { AppConfigService } from 'src/config/config.service';
import { createConnections } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (config: AppConfigService) =>
      await createConnections([
        {
          name: 'database',
          type: 'postgres' as 'postgres',
          host: config.databaseHost,
          port: config.databasePort,
          username: config.databaseUser,
          password: config.databasePass,
          database: config.databaseName,

          entities: [join(__dirname, 'entities/*.entity.{ts,js}')],
          synchronize: !config.isProduction,
          logging: config.isProduction ? ['error'] : 'all',

          migrationsTableName: 'migrations',
          migrations: [join(__dirname, 'migrations/*.ts')],
          cli: {
            migrationsDir: join(__dirname, 'migrations'),
          },

          ssl: config.isProduction,
        },
      ]),
    inject: [AppConfigService],
  },
];
