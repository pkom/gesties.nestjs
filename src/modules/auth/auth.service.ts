import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LdapUserDto } from './dto/ldapUserDto';
import { User } from '../../entities';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  login(ldapUserDto: LdapUserDto) {
    const user = new User();
    user.uid = ldapUserDto.uid;
    user.cn = ldapUserDto.cn;
    user.email = ldapUserDto.email;
    user.employeeNumber = ldapUserDto.employeeNumber;
    user.gidNumber = ldapUserDto.gidNumber;
    user.uidNumber = ldapUserDto.uidNumber;
    user.givenName = ldapUserDto.givenName;
    user.sn = ldapUserDto.sn;
    const payload = {
      username: user.cn,
      sub: user.uid,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
