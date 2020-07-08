import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { CentersModule } from './modules/centers/centers.module';
// import { configService } from './config/config.service';
import { StudentsModule } from './modules/students/students.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { GroupsModule } from './modules/groups/groups.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { CoursesModule } from './modules/courses/courses.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    // TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: +configService.get<number>('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),

        entities: [__dirname + '/entities/*.entity.{ts,js}'],
        synchronize: configService.get('mode') === 'development',
        logging:
          configService.get('mode') !== 'development' ? ['error'] : 'all',

        migrationsTableName: 'migrations',
        migrations: [__dirname + '/migrations/*.ts'],
        cli: {
          migrationsDir: __dirname + '/migrations',
        },

        ssl: configService.get('mode') !== 'development',
      }),
      inject: [ConfigService],
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
