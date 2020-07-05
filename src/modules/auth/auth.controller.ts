import { Controller, UseGuards, Request, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LdapAuthGuard } from './ldap-auth.guard';

@Controller('auth')
export class AuthController {
  @UseGuards(LdapAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return req.user;
  }
}
