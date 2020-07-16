import { readFileSync } from 'fs';
import { validate } from 'class-validator';

import * as Strategy from 'passport-ldapauth';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';

import { LdapUserDto } from '../dto/ldapUserDto';
import { UserDto } from '../../users/dto/user.dto';
import { AppConfigService } from '../../../config/config.service';

@Injectable()
export class LdapStrategy extends PassportStrategy(Strategy, 'ldap') {
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
  async validate(req: Request, ldapUserDto: LdapUserDto, done: Function) {
    try {
      if (ldapUserDto._groups) {
        ldapUserDto.groups = ldapUserDto._groups.map(group => group.cn);
      }
      if (ldapUserDto.groups.includes('students')) {
        done(new UnauthorizedException('Login not allowed to students'), false);
      }
      delete ldapUserDto.dn;
      delete ldapUserDto.controls;
      delete ldapUserDto._groups;
      const userDto = new UserDto();
      userDto.userName = ldapUserDto.uid;
      userDto.uidNumber = ldapUserDto.uidNumber;
      userDto.gidNumber = ldapUserDto.gidNumber;
      userDto.employeeNumber = ldapUserDto.employeeNumber;
      userDto.firstName = ldapUserDto.givenName;
      userDto.lastName = ldapUserDto.sn;
      userDto.email = ldapUserDto.mail;
      userDto.fullName = ldapUserDto.cn;
      userDto.groups = ldapUserDto.groups;
      const errors = await validate(userDto);
      if (errors.length > 0) {
        done(new BadRequestException(errors), false);
      }
      done(null, userDto);
    } catch (error) {
      done(error, false);
    }
  }
}
