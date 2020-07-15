import { readFileSync } from 'fs';

import * as Strategy from 'passport-ldapauth';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

import { LdapUserDto } from '../dto/ldapUserDto';
import { UserDto } from '../../users/dto/user.dto';
import { AppConfigService } from '../../../config/config.service';

@Injectable()
export class LdapStrategy extends PassportStrategy(Strategy, 'ldap') {
  constructor(private config: AppConfigService) {
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
    if (ldapUserDto._groups) {
      ldapUserDto.groups = ldapUserDto._groups.map(group => group.cn);
    }
    if (ldapUserDto.groups.includes('students')) {
      return done(
        new UnauthorizedException('Login not allowed to students'),
        false,
      );
    }
    delete ldapUserDto.dn;
    delete ldapUserDto.controls;
    delete ldapUserDto._groups;
    const userDto: UserDto = {
      userName: ldapUserDto.uid,
      uidNumber: ldapUserDto.uidNumber,
      gidNumber: ldapUserDto.gidNumber,
      employeeNumber: ldapUserDto.employeeNumber,
      firstName: ldapUserDto.givenName,
      lastName: ldapUserDto.sn,
      email: ldapUserDto.mail,
      fullName: ldapUserDto.cn,
      groups: ldapUserDto.groups,
    };
    req.user = userDto;
    return done(null, userDto);
  }
}
