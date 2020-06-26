import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';

config();

enum Environment {
  PRODUCTION = 'PROD',
  DEVELOPMENT = 'DEV',
  TEST = 'TEST',
}
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
    return mode === Environment.PRODUCTION;
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.isProduction()
        ? this.getValue('POSTGRES_DATABASE_PRODUCTION')
        : this.getValue('POSTGRES_DATABASE_DEVELOPMENT'),
      synchronize: !this.isProduction(),
      entities: [__dirname + '/../entities/**/*.entity.{ts,js}'],
      logging: !this.isProduction() ? 'all' : ['error'],
      // migrations
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
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE_PRODUCTION',
  'POSTGRES_DATABASE_DEVELOPMENT',
  'LDAP_HOST',
  'LDAP_PORT',
  'LDAP_USER',
  'LDAP_USER_PASSWORD',
]);

export { configService };
