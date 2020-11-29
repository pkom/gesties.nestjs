import { readFileSync } from 'fs';
import { validate } from 'class-validator';

import * as Strategy from 'passport-ldapauth';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';

import { UserLdapDto } from '../dto/user-ldap.dto';
import { UserDto } from '../../users/dto/user.dto';
import { AppConfigService } from '../../../config/config.service';

@Injectable()
export class LdapStrategy extends PassportStrategy(Strategy, 'ldap') {
  private logger = new Logger('LdapAuth');

  constructor(private readonly config: AppConfigService) {
    super({
      passReqToCallback: true,
      server: {
        url: config.ldapHost,
        bindDN: config.ldapUser,
        bindCredentials: config.ldapPass,
        searchBase: 'ou=People,dc=instituto,dc=extremadura,dc=es',
        searchFilter: '(uid={{username}})',
        searchAttributes: [
          'employeeNumber',
          'cn',
          'givenName',
          'sn',
          'uid',
          'uidNumber',
          'gidNumber',
          'mail',
        ],
        groupSearchBase: 'ou=Group,dc=instituto,dc=extremadura,dc=es',
        groupSearchAttributes: ['cn'],
        groupSearchFilter:
          '(&(objectClass=groupOfNames)(memberUid={{username}}))',
        tlsOptions: {
          ca: readFileSync(config.ldapCert),
        },
      },
    });
  }
  async validate(req: Request, userLdapDto: UserLdapDto, done: Function) {
    try {
      if (userLdapDto._groups) {
        userLdapDto.groups = userLdapDto._groups.map(group => group.cn);
      }
      if (userLdapDto.groups.includes('students')) {
        this.logger.error(
          `Student ${userLdapDto.uid} is trying to authenticate`,
        );
        done(new UnauthorizedException('Login not allowed to students'), false);
      }
      delete userLdapDto.dn;
      delete userLdapDto.controls;
      delete userLdapDto._groups;
      const userDto = new UserDto();
      userDto.userName = userLdapDto.uid;
      userDto.uidNumber = userLdapDto.uidNumber;
      userDto.gidNumber = userLdapDto.gidNumber;
      userDto.employeeNumber = userLdapDto.employeeNumber;
      userDto.firstName = userLdapDto.givenName;
      userDto.lastName = userLdapDto.sn;
      userDto.email = userLdapDto.mail;
      userDto.fullName = userLdapDto.cn;
      userDto.groups = userLdapDto.groups;
      const errors = await validate(UserDto);
      if (errors.length > 0) {
        this.logger.error(
          `Error validating UserDto: ${JSON.stringify(userDto)}`,
        );
        done(new BadRequestException(errors), false);
      }
      done(null, userDto);
    } catch (error) {
      this.logger.error(`Ldap authentication error`, error.stack);
      done(error, false);
    }
  }
}
