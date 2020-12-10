import { join } from 'path';

import {
  Module,
  // NestModule,
  // RequestMethod,
  // MiddlewareConsumer,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CentersModule } from './modules/centers/centers.module';
import { AppConfigModule } from './config/config.module';
import { AppConfigService } from './config/config.service';
import { StudentsModule } from './modules/students/students.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { GroupsModule } from './modules/groups/groups.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { CoursesModule } from './modules/courses/courses.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';

// import { LoggerMiddleware } from './common/shared/middlewares/logger.middleware';
import { ConfigurationModule } from './modules/configuration/configuration.module';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (config: AppConfigService) => ({
        type: 'postgres' as 'postgres',
        host: config.databaseHost,
        port: config.databasePort,
        username: config.databaseUser,
        password: config.databasePass,
        database: config.databaseName,

        entities: [join(__dirname, 'entities/*.entity.{ts,js}')],
        synchronize: !config.isProduction,
        logging: config.isProduction ? ['error'] : ['info'],

        migrationsTableName: 'migrations',
        migrations: [join(__dirname, 'migrations/*.ts')],
        cli: {
          migrationsDir: join(__dirname, 'migrations'),
        },

        ssl: false, //config.isProduction,
      }),
      inject: [AppConfigService],
    }),
    CentersModule,
    StudentsModule,
    TeachersModule,
    GroupsModule,
    DepartmentsModule,
    CoursesModule,
    AuthModule,
    UsersModule,
    RolesModule,
    ConfigurationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(LoggerMiddleware).forRoutes({
//       path: '*',
//       method: RequestMethod.ALL,
//     });
//   }
// }
