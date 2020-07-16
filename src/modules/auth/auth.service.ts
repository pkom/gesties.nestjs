import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto/user.dto';
import { RoleDto } from '../roles/dto/role.dto';
import { UserRole } from '../../common/shared/enums/user.roles';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { RolesService } from '../roles/roles.service';
import { User } from '../../entities';
import { TeachersService } from '../teachers/teachers.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly jwtService: JwtService,
    private readonly teachersService: TeachersService,
  ) {}

  async validateLdapLogin(userDto: UserDto): Promise<object> {
    try {
      const { groups } = userDto;
      delete userDto.groups;
      let user = await this.usersService.getByName(userDto.userName);
      if (!user) {
        user = await this.usersService.create(userDto);
      } else {
        user = await this.usersService.update(user.id, userDto);
      }
      user = await this.setRoles(user, groups);

      const teacher = await this.teachersService.getByEmployeeNumber(
        user.employeeNumber,
      );
      if (teacher) {
        user.teacher = teacher;
        user = await this.usersService.save(user);
      }

      const payload: JwtPayload = {
        sub: user.userName,
        roles: user.roles.map(role => role.name as UserRole),
      };
      return {
        token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'validateLdapLogin',
        error.message,
      );
    }
  }

  private async setRoles(user: User, groups: string[]): Promise<User> {
    const isAdministrator = groups.includes('administrator');
    const isAdministration = groups.includes('administration');
    const isResponsible = groups.includes('responsible');
    const isTeacher = groups.includes('teachers');
    const isStudent = groups.includes('students');
    const roles = [];
    if (isAdministrator) {
      let role = await this.rolesService.findOne(UserRole.ADMINISTRATOR);
      if (!role) {
        const roleAdmin = new RoleDto();
        roleAdmin.name = UserRole.ADMINISTRATOR;
        roleAdmin.description = UserRole.ADMINISTRATOR as string;
        role = await this.rolesService.create(roleAdmin);
      }
      roles.push(role);
    }
    if (isResponsible) {
      let role = await this.rolesService.findOne(UserRole.RESPONSIBLE);
      if (!role) {
        const roleResponsible = new RoleDto();
        roleResponsible.name = UserRole.RESPONSIBLE;
        roleResponsible.description = UserRole.RESPONSIBLE as string;
        role = await this.rolesService.create(roleResponsible);
      }
      roles.push(role);
    }
    if (isAdministration) {
      let role = await this.rolesService.findOne(UserRole.ADMINISTRATION);
      if (!role) {
        const roleAdministration = new RoleDto();
        roleAdministration.name = UserRole.ADMINISTRATION;
        roleAdministration.description = UserRole.ADMINISTRATION as string;
        role = await this.rolesService.create(roleAdministration);
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
