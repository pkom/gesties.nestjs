export interface JwtPayload {
  sub: string;
  uid: string;
  sn?: string;
  givenName?: string;
  email?: string;
  employeeNumber: string;
  cn?: string;
  roles: string[];
}
