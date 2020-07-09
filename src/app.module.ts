import { join } from 'path';

import { Module } from '@nestjs/common';
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
import { DatabaseType } from 'typeorm';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (config: AppConfigService) => ({
        type: 'postgres',
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
