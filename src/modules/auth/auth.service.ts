import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { UserDTO } from '../users/dto/user.dto';
import { RoleDTO } from '../roles/dto/role.dto';
import { UserRole } from '../../common/shared/enums/user.roles';
import { JwtPayload } from './jwt-payload.interface';
import { User } from '../../entities';
import { UsersRepository } from '../users/users.repository';
import { TeachersRepository } from '../teachers/teachers.repository';
import { RolesRepository } from '../roles/roles.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
    @InjectRepository(TeachersRepository)
    private readonly teachersRepository: TeachersRepository,
    @InjectRepository(RolesRepository)
    private readonly rolesRepository: RolesRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateLdapLogin(userDTO: UserDTO): Promise<{ token: string }> {
    try {
      const { groups } = userDTO;
      delete userDTO.groups;
      let user = await this.usersRepository.getByName(userDTO.userName);
      if (!user) {
        user = this.usersRepository.create(userDTO);
      } else {
        await this.usersRepository.update(user.id, { ...userDTO });
      }
      user = await this.setRoles(user, groups);

      const teacher = await this.teachersRepository.getByEmployeeNumber(
        user.employeeNumber,
      );
      if (teacher) {
        user.teacher = teacher;
        user = await this.usersRepository.save(user);
      }

      const payload: JwtPayload = {
        username: user.userName,
        sub: user.id,
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
      let role = await this.rolesRepository.findByRoleName(
        UserRole.ADMINISTRATOR,
      );
      if (!role) {
        const roleAdmin = new RoleDTO();
        roleAdmin.name = UserRole.ADMINISTRATOR;
        roleAdmin.description = UserRole.ADMINISTRATOR as string;
        role = this.rolesRepository.create(roleAdmin);
      }
      roles.push(role);
    }
    if (isResponsible) {
      let role = await this.rolesRepository.findByRoleName(
        UserRole.RESPONSIBLE,
      );
      if (!role) {
        const roleResponsible = new RoleDTO();
        roleResponsible.name = UserRole.RESPONSIBLE;
        roleResponsible.description = UserRole.RESPONSIBLE as string;
        role = this.rolesRepository.create(roleResponsible);
      }
      roles.push(role);
    }
    if (isAdministration) {
      let role = await this.rolesRepository.findByRoleName(
        UserRole.ADMINISTRATION,
      );
      if (!role) {
        const roleAdministration = new RoleDTO();
        roleAdministration.name = UserRole.ADMINISTRATION;
        roleAdministration.description = UserRole.ADMINISTRATION as string;
        role = this.rolesRepository.create(roleAdministration);
      }
      roles.push(role);
    }
    if (isTeacher) {
      let role = await this.rolesRepository.findByRoleName(UserRole.TEACHER);
      if (!role) {
        const roleTeacher = new RoleDTO();
        roleTeacher.name = UserRole.TEACHER;
        roleTeacher.description = UserRole.TEACHER as string;
        role = this.rolesRepository.create(roleTeacher);
      }
      roles.push(role);
    }
    if (isStudent) {
      let role = await this.rolesRepository.findByRoleName(UserRole.STUDENT);
      if (!role) {
        const roleStudent = new RoleDTO();
        roleStudent.name = UserRole.STUDENT;
        roleStudent.description = UserRole.STUDENT as string;
        role = this.rolesRepository.create(roleStudent);
      }
      roles.push(role);
    }
    user.roles = roles;
    return await this.usersRepository.save(user);
  }

  async validateUser(payload: JwtPayload) {
    // const user = await this.usersService.getById(payload.sub);
    // const userr = classToPlain(user);
    return payload;
  }
}
