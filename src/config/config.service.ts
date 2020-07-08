import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';

config();

class ConfigService {
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
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
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
    return this.getValue('JWT_SECRET');
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),
      entities: [__dirname + '/../entities/**/*.entity.{ts,js}'],
      // entities: ['src/entities/*.entity.{ts,js}'],

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

const configService = new ConfigService(process.env).ensureValues([
  'PORT',
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE',
  'LDAP_HOST',
  'LDAP_USER',
  'LDAP_USER_PASSWORD',
  'LDAP_CERT_FILE',
  'JWT_SECRET',
]);

export { configService };
