import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';

config();

class ConfigServiceRayuela {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }
    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach(k => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('APP_PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('APP_MODE', false);
    return mode === 'production';
  }

  public getLdapConfig() {
    return {
      host: this.getValue('LDAP_HOST'),
      user: this.getValue('LDAP_USER'),
      password: this.getValue('LDAP_USER_PASSWORD'),
      certificate: this.getValue('LDAP_CERT_FILE'),
    };
  }

  public getJwtSecret() {
    return this.getValue('APP_JWT_SECRET');
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getValue('DATABASE_HOST'),
      port: parseInt(this.getValue('DATABASE_PORT')),
      username: this.getValue('DATABASE_USER'),
      password: this.getValue('DATABASE_PASSWORD'),
      database: this.getValue('DATABASE_NAME'),

      entities: [__dirname + '/../entities/**/*.entity.{ts,js}'],

      synchronize: !this.isProduction(),
      logging: this.isProduction() ? ['error'] : 'all',

      migrationsTableName: 'migration',
      migrations: ['src/migration/*.ts'],
      cli: {
        migrationsDir: 'src/migration',
      },

      ssl: this.isProduction(),
    };
  }
}

const configService = new ConfigServiceRayuela(process.env).ensureValues([
  'APP_PORT',
  'APP_JWT_SECRET',
  'APP_MODE',
  'DATABASE_HOST',
  'DATABASE_PORT',
  'DATABASE_USER',
  'DATABASE_PASSWORD',
  'DATABASE_NAME',
  'LDAP_HOST',
  'LDAP_USER',
  'LDAP_USER_PASSWORD',
  'LDAP_CERT_FILE',
]);

export { configService };
