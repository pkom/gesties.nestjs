import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { LdapStrategy } from './ldap.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [UsersModule, PassportModule],
  providers: [AuthService, LdapStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
