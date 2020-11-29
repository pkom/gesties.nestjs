import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { UserDto } from '../users/dto/user.dto';
import { RoleDTO } from '../roles/dto/role.dto';
import { UserRole } from '../../common/shared/enums/user.roles';
import { JwtPayload } from './jwt-payload.interface';
import { User, Role, Course } from '../../entities';
import { UsersRepository } from '../users/users.repository';
import { TeachersRepository } from '../teachers/teachers.repository';
import { RolesRepository } from '../roles/roles.repository';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,    
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
    @InjectRepository(TeachersRepository)
    private readonly teachersRepository: TeachersRepository,
    @InjectRepository(RolesRepository)
    private readonly rolesRepository: RolesRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateLdapLogin(userDto: UserDto, courseId: string): Promise<{ token: string }> {
    // check if course exists
    const course = await this.coursesRepository.findOne(courseId);
    if (!course) {
      throw new UnauthorizedException(`Course with id ${courseId} does not exist.`)        
    }
    try {
      const { groups } = userDto;
      delete userDto.groups;
      let user = await this.usersRepository.getByName(userDto.userName);
      if (!user) {
        user = this.usersRepository.create(userDto);
        this.logger.debug(`User ${user.userName} has been created`);
      } else {
        await this.usersRepository.update(user.id, { ...userDto });
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
        courseid: courseId,
        roles: user.roles.map(role => role.name as UserRole),
      };
      this.logger.verbose(`Token generated for user ${user.userName}`);
      return {
        token: this.jwtService.sign(payload),
      };
    } catch (error) {
      this.logger.error(
        `Error generating token for user ${userDto.userName}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'validateLdapLogin',
        error.message,
      );
    }
  }

  private async setRoles(user: User, groups: string[]): Promise<User> {
    try {
      const isAdministrator = groups.includes('administrator');
      const isAdministration = groups.includes('administration');
      const isResponsible = groups.includes('responsible');
      const isTeacher = groups.includes('teachers');
      const isStudent = groups.includes('students');
      const roles: Role[] = [];
      if (isAdministrator) {
        roles.push(await this.createRole(UserRole.ADMINISTRATOR));
      }
      if (isResponsible) {
        roles.push(await this.createRole(UserRole.RESPONSIBLE));
      }
      if (isAdministration) {
        roles.push(await this.createRole(UserRole.ADMINISTRATION));
      }
      if (isTeacher) {
        roles.push(await this.createRole(UserRole.TEACHER));
      }
      if (isStudent) {
        roles.push(await this.createRole(UserRole.STUDENT));
      }
      user.roles = roles;
      return await this.usersRepository.save(user);
    } catch (error) {
      this.logger.error(
        `Error setting roles for user ${user.userName}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'validateLdapLogin',
        error.message,
      );
    }
  }

  private async createRole(userRole: UserRole): Promise<Role> {
    try {
      let role = await this.rolesRepository.findByRoleName(userRole);
      if (!role) {
        const roleDTO = new RoleDTO();
        roleDTO.name = userRole;
        roleDTO.description = userRole;
        role = await this.rolesRepository.save(roleDTO);
        this.logger.debug(`Role ${userRole} created`);
      }
      return role;
    } catch (error) {
      this.logger.error(`Error creating role ${userRole}`, error.stack);
      throw new InternalServerErrorException(
        'validateLdapLogin',
        error.message,
      );
    }
  }

  async validateUser(payload: JwtPayload) {
    // const user = await this.usersService.getById(payload.sub);
    // const userr = classToPlain(user);
    return payload;
  }
}
