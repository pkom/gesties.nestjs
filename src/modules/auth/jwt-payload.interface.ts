import { UserRole } from '../../common/shared/enums/user.roles';

export interface JwtPayload {
  sub: string;
  roles: UserRole[];
}
