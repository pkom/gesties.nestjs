import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto/user.dto';
import { RoleDto } from '../roles/dto/role.dto';
import { UserRole } from '../../common/shared/enums/user.roles';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { RolesService } from '../roles/roles.service';
import { User } from 'src/entities';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly jwtService: JwtService,
  ) {}

  async login(userDto: UserDto): Promise<any> {
    // create user if does not exist using or mapping ldap to user dto
    // using groups, process roles creating roles and assign to user
    // create roles list and include in payload roles property
    const { groups } = userDto;
    delete userDto.groups;
    let user = await this.usersService.getByName(userDto.userName);
    if (!user) {
      user = await this.usersService.create(userDto);
    } else {
      user = await this.usersService.update(user.id, userDto);
    }
    user = await this.setRoles(user, groups);

    const payload: JwtPayload = {
      sub: user.userName,
      roles: user.roles.map(role => role.name as UserRole),
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async setRoles(user: User, groups: string[]): Promise<User> {
    const isAdmin = groups.includes('admins');
    const isTeacher = groups.includes('teachers');
    const isStudent = groups.includes('students');
    const roles = [];
    if (isAdmin) {
      let role = await this.rolesService.findOne(UserRole.ADMINISTRATION);
      if (!role) {
        const roleAdmin = new RoleDto();
        roleAdmin.name = UserRole.ADMINISTRATION;
        roleAdmin.description = UserRole.ADMINISTRATION as string;
        role = await this.rolesService.create(roleAdmin);
      }
      roles.push(role);
    }
    if (isTeacher) {
      let role = await this.rolesService.findOne(UserRole.TEACHER);
      if (!role) {
        const roleTeacher = new RoleDto();
        roleTeacher.name = UserRole.TEACHER;
        roleTeacher.description = UserRole.TEACHER as string;
        role = await this.rolesService.create(roleTeacher);
      }
      roles.push(role);
    }
    if (isStudent) {
      let role = await this.rolesService.findOne(UserRole.STUDENT);
      if (!role) {
        const roleStudent = new RoleDto();
        roleStudent.name = UserRole.STUDENT;
        roleStudent.description = UserRole.STUDENT as string;
        role = await this.rolesService.create(roleStudent);
      }
      roles.push(role);
    }
    user.roles = roles;
    return await this.usersService.save(user);
  }

  async validateUser(payload: JwtPayload) {
    const user = await this.usersService.getByName(payload.sub);
    return user;
  }
}
