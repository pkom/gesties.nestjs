import { EntityRepository, Repository } from 'typeorm';

import { Role } from '../../entities';
import { RoleDTO } from './dto/role.dto';
import { UserRole } from '../../common/shared/enums/user.roles';

@EntityRepository(Role)
export class RolesRepository extends Repository<Role> {
  public async findByRoleName(roleName: UserRole): Promise<Role | undefined> {
    return await this.findOne({ name: roleName });
  }

  public async getOrCreate(roleDTO: RoleDTO): Promise<Role> {
    let role = await this.findOne({ name: roleDTO.name });
    if (!role) {
      role = await this.save(roleDTO);
    } else {
      await this.update({ name: roleDTO.name }, { ...roleDTO });
    }
    return role;
  }
}
