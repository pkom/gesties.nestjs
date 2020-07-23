import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Role } from '../../entities';
import { RoleDTO } from './dto/role.dto';
import { UserRole } from 'src/common/shared/enums/user.roles';
import { RolesRepository } from './roles.repository';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RolesRepository)
    private readonly rolesRepository: RolesRepository,
  ) {}

  async create(roleDTO: RoleDTO): Promise<Role> {
    return await this.rolesRepository.save(roleDTO);
  }
}
