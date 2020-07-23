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
import { UserDTO } from '../../users/dto/user.dto';
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
      const userDTO = new UserDTO();
      userDTO.userName = ldapUserDto.uid;
      userDTO.uidNumber = ldapUserDto.uidNumber;
      userDTO.gidNumber = ldapUserDto.gidNumber;
      userDTO.employeeNumber = ldapUserDto.employeeNumber;
      userDTO.firstName = ldapUserDto.givenName;
      userDTO.lastName = ldapUserDto.sn;
      userDTO.email = ldapUserDto.mail;
      userDTO.fullName = ldapUserDto.cn;
      userDTO.groups = ldapUserDto.groups;
      const errors = await validate(userDTO);
      if (errors.length > 0) {
        done(new BadRequestException(errors), false);
      }
      done(null, userDTO);
    } catch (error) {
      done(error, false);
    }
  }
}
