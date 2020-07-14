import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../entities';
import { RoleDto } from './dto/role.dto';
import { UserRole } from 'src/common/shared/enums/user.roles';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  public async getOrCreate(roleDto: RoleDto): Promise<Role> {
    let role = await this.rolesRepository.findOne({ name: roleDto.name });
    if (!role) {
      role = await this.rolesRepository.save(roleDto);
    } else {
      await this.rolesRepository.update({ name: roleDto.name }, roleDto);
    }
    return role;
  }

  async findOne(roleName: UserRole): Promise<Role | undefined> {
    return await this.rolesRepository.findOne({ name: roleName });
  }

  async create(roleDto: RoleDto): Promise<Role> {
    return await this.rolesRepository.save(roleDto);
  }
}
