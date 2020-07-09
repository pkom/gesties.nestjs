import { readFileSync } from 'fs';
import { join } from 'path';

import * as Strategy from 'passport-ldapauth';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { LdapUserDto } from '../dto/ldapUserDto';
import { AppConfigService } from '../../../config/config.service';

@Injectable()
export class LdapStrategy extends PassportStrategy(Strategy, 'ldap') {
  constructor(private config: AppConfigService) {
    super(
      {
        usernameField: 'username',
        passwordField: 'password',
        handleErrorsAsFailures: true,
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
            ca: readFileSync(
              join(__dirname, '../../../../../ssl', config.ldapCert),
            ),
          },
        },
      },
      async (req: Request, user: LdapUserDto, done) => {
        if (user._groups) {
          user.groups = user._groups.map(group => group.cn);
        }
        const { controls, _groups, ...userReturned } = user;
        req.user = userReturned;
        return done(null, userReturned);
      },
    );
  }
}
