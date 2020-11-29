export interface UserLdapDto {
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
}

export interface LdapGroupDto {
  dn: string;
  controls: [];
  cn: string;
}
