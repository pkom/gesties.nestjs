import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { LdapStrategy } from './strategies/ldap.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigService } from '../../config/config.service';
import { AppConfigModule } from '../../config/config.module';
import { RolesModule } from '../roles/roles.module';
import { TeachersModule } from '../teachers/teachers.module';
import { CoursesModule } from '../courses/courses.module';

@Module({
  imports: [
    CoursesModule,
    UsersModule,
    TeachersModule,
    RolesModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      useFactory: async (config: AppConfigService) => ({
        secret: config.jwtSecret,
        signOptions: { expiresIn: config.jwtTokenExp },
      }),
      inject: [AppConfigService],
    }),
  ],
  providers: [AuthService, LdapStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
