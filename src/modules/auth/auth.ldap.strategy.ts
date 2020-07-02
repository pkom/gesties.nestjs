import * as Strategy from 'passport-ldapauth';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
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
          searchBase: 'o=users,o=example.com',
          searchFilter: '(uid={{username}})',
          searchAttributes: ['displayName', 'mail'],
        },
      },
      async (req: Request, user: any, done) => {
        req.user = user;
        return done(null, user);
      },
    );
  }
}
