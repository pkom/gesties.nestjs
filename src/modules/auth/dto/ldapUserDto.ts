import { User } from '../../../entities';

export class LdapUserDto implements Readonly<LdapUserDto> {
  dn: string;
  uid: string;
  uidNumber: string;
  gidNumber: string;
  sn: string;
  givenName: string;
  employeeNumber: string;
  email?: string;
  cn: string;
  _groups?: LdapGroupDto[];
  groups?: string[];
  controls: [];

  public static from(dto: Partial<LdapUserDto>) {
    const it = new LdapUserDto();
    // it.id = dto.id;
    // it.code = dto.code;
    // it.denomination = dto.denomination;
    return it;
  }

  public static fromEntity(entity: User) {
    return this.from({
      // id: entity.id,
      // code: entity.code,
      // denomination: entity.denomination,
    });
  }

  public toEntity() {
    const it = new User();
    it.uid = this.uid;
    it.sn = this.sn;
    it.givenName = this.givenName;
    it.uidNumber = this.uidNumber;
    it.gidNumber = this.uidNumber;
    it.employeeNumber = this.employeeNumber;
    it.email = this.email;
    it.cn = this.cn;
    it.roles = [];
    return it;
  }
}

export interface LdapGroupDto {
  dn: string;
  controls: [];
  cn: string;
}
