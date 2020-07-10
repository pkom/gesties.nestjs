import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LdapUserDto } from './dto/ldapUserDto';
import { User } from '../../entities';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(ldapUserDto: LdapUserDto) {
    const user = await this.usersService.getOrCreate(ldapUserDto);
    const payload: JwtPayload = {
      employeeNumber: user.employeeNumber,
      roles: [],
      uid: user.uid,
      cn: user.cn,
      sub: user.uid,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async validateUser(payload: JwtPayload) {
    return {};
  }
}
