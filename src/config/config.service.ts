import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseType } from 'typeorm';
/**
 * Service dealing with app config based operations.
 *
 * @class
 */
@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get port(): number {
    return Number(this.configService.get<number>('port'));
  }
  get mode(): string {
    return this.configService.get<string>('mode');
  }
  get googleMapsApiKey(): string {
    return this.configService.get<string>('googleMapsApiKey');
  }
  get jwtSecret(): string {
    return this.configService.get<string>('jwtSecret');
  }
  get jwtTokenExp(): string {
    return this.configService.get<string>('jwtTokenExp');
  }

  get databaseType(): DatabaseType {
    return this.configService.get<DatabaseType>('database.type');
  }
  get databaseHost(): string {
    return this.configService.get<string>('database.host');
  }
  get databasePort(): number {
    return Number(this.configService.get<string>('database.port'));
  }
  get databaseUser(): string {
    return this.configService.get<string>('database.username');
  }
  get databasePass(): string {
    return this.configService.get<string>('database.password');
  }
  get databaseName(): string {
    return this.configService.get<string>('database.name');
  }

  get ldapHost(): string {
    return this.configService.get<string>('ldap.host');
  }
  get ldapUser(): string {
    return this.configService.get<string>('ldap.user');
  }
  get ldapPass(): string {
    return this.configService.get<string>('ldap.password');
  }
  get ldapCert(): string {
    return this.configService.get<string>('ldap.certificate');
  }
}
