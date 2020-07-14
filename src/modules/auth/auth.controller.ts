import { Controller, UseGuards, Request, Post, Get } from '@nestjs/common';
import { LdapAuthGuard } from '../../common/shared/guards/ldap-auth.guard';
import { JwtAuthGuard } from '../../common/shared/guards/jwt-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LdapAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<any> {
    const jwtToken = await this.authService.login(req.user);
    return jwtToken;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
