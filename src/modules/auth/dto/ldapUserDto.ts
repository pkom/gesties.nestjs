import { Column } from 'typeorm';

export interface LdapUserDto {
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
}

export interface LdapGroupDto {
  dn: string;
  controls: [];
  cn: string;
}
