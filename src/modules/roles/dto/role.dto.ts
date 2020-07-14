import { Role } from '../../../entities';
import { UserRole } from 'src/common/shared/enums/user.roles';

export class RoleDto implements Readonly<RoleDto> {
  name: UserRole;
  description: string;

  public static from(dto: Partial<RoleDto>) {
    const it = new RoleDto();
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
