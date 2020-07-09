import * as Joi from '@hapi/joi';
import { Global, Module } from '@nestjs/common';
import configuration from './configuration';
import { AppConfigService } from './config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
/**
 * Import and provide app configuration related classes.
 *
 * @module
 */
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        APP_PORT: Joi.number().default(3000),
        APP_MODE: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        APP_GOOGLE_MAPS_API_KEY: Joi.string(),
        APP_JWT_SECRET: Joi.string().default('secret'),
        APP_JWT_TOKEN_EXPIRATION: Joi.string().default('60s'),

        DATABASE_TYPE: Joi.string()
          .valid(
            'postgres',
            'mysql',
            'mariadb',
            'sqlite',
            'oracle',
            'mssql',
            'mongodb',
          )
          .default('postgres'),
        DATABASE_HOST: Joi.string().default('localhost'),
        DATABASE_PORT: Joi.number().default(5432),
        DATABASE_USER: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),

        LDAP_HOST: Joi.string().required(),
        LDAP_USER: Joi.string().required(),
        LDAP_USER_PASSWORD: Joi.string().required(),
        LDAP_CERT_FILE: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService, AppConfigService],
  exports: [ConfigService, AppConfigService],
})
export class AppConfigModule {}
