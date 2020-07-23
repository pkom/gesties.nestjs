import { Controller, UseGuards, Request, Post, Get } from '@nestjs/common';
import { LdapAuthGuard } from '../../common/shared/guards/ldap-auth.guard';
import { JwtAuthGuard } from '../../common/shared/guards/jwt-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LdapAuthGuard)
  @Post('login')
  login(@Request() req): Promise<{ token: string }> {
    return this.authService.validateLdapLogin(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
