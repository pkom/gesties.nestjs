import * as Strategy from 'passport-ldapauth';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { configService } from '../../config/config.service';

@Injectable()
export class LdapStrategy extends PassportStrategy(Strategy, 'ldap') {
  constructor() {
    super(
      {
        passReqToCallback: true,
        server: {
          url: configService.getLdapConfig().host,
          bindDN: configService.getLdapConfig().user,
          bindCredentials: configService.getLdapConfig().password,
          searchBase: 'ou=People,dc=instituto,dc=extremadura,dc=es',
          searchFilter: '(uid={{username}})',
          searchAttributes: ['employeeNumber', 'cn', 'givenName', 'sn', 'uid'],
          groupSearchBase: 'ou=Group,dc=instituto,dc=extremadura,dc=es',
          groupSearchAttributes: ['cn'],
          groupSearchFilter:
            '(&(objectClass=groupOfNames)(memberUid={{username}}))',
        },
      },
      async (req: Request, user: any, done) => {
        req.user = user;
        return done(null, user);
      },
    );
  }
}
