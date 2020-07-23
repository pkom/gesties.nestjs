import { Role } from '../../../entities';
import { UserRole } from 'src/common/shared/enums/user.roles';

export class RoleDTO implements Readonly<RoleDTO> {
  name: UserRole;
  description: string;

  public static from(dto: Partial<RoleDTO>) {
    const it = new RoleDTO();
    it.name = dto.name;
    it.description = dto.description;
    return it;
  }

  public static fromEntity(entity: Role) {
    return this.from({
      name: entity.name as UserRole,
      description: entity.description,
    });
  }

  public toEntity() {
    const it = new Role();
    it.name = this.name;
    it.description = it.description;
    return it;
  }
}
