import { Controller, UseGuards, Request, Post } from '@nestjs/common';
import { LdapAuthGuard } from './ldap-auth.guard';

@Controller('auth')
export class AuthController {
  @UseGuards(LdapAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return req.user;
  }
}
