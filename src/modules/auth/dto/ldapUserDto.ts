import { User } from '../../../entities';

export class LdapUserDto implements Readonly<LdapUserDto> {
  dn: string;
  uid: string;
  uidNumber: string;
  gidNumber: string;
  sn: string;
  givenName: string;
  employeeNumber: string;
  mail?: string;
  cn: string;
  _groups?: LdapGroupDto[];
  groups: string[];
  controls: [];

  public static from(dto: Partial<LdapUserDto>) {
    const it = new LdapUserDto();
    it.uid = dto.uid;
    it.sn = dto.sn;
    it.givenName = dto.givenName;
    it.cn = it.cn;
    it.employeeNumber = dto.employeeNumber;
    it.mail = dto.mail;
    return it;
  }

  public static fromEntity(user: User) {
    return this.from({
      uid: user.userName,
      sn: user.lastName,
      givenName: user.firstName,
      cn: user.fullName,
      employeeNumber: user.employeeNumber,
      mail: user.email,
    });
  }

  public toEntity() {
    const it = new User();
    it.userName = this.uid;
    it.lastName = this.sn;
    it.firstName = this.givenName;
    it.fullName = this.cn;
    it.employeeNumber = this.employeeNumber;
    it.email = this.mail;
    return it;
  }
}

export interface LdapGroupDto {
  dn: string;
  controls: [];
  cn: string;
}
