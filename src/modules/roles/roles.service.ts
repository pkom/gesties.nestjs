import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Role } from '../../entities';
import { RoleDTO } from './dto/role.dto';
import { RolesRepository } from './roles.repository';
import { UserRole } from '../../common/shared/enums/user.roles';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RolesRepository)
    private readonly rolesRepository: RolesRepository,
  ) {}

  async getRoles(): Promise<Role[]> {
    return await this.rolesRepository.find();
  }

  async getRoleByName(userRole: UserRole): Promise<Role> {
    const found = await this.rolesRepository.findOne({
      where: { name: userRole },
    });
    if (!found) {
      throw new NotFoundException(`Role with name ${userRole} not found`);
    }
    return found;
  }

  async getRoleById(id: string): Promise<Role> {
    const found = await this.rolesRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return found;
  }

  async createRole(roleDTO: RoleDTO): Promise<Role> {
    return await this.rolesRepository.save(roleDTO);
  }

  async deleteRole(id: string): Promise<void> {
    const result = await this.rolesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
  }

  async updateRole(id: string, description: string): Promise<Role> {
    const role = await this.getRoleById(id);
    role.description = description;
    await this.rolesRepository.save(role);
    return role;
  }
}
