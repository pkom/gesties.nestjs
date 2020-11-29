import { UserRole } from '../../common/shared/enums/user.roles';

export interface JwtPayload {
  username: string;
  sub: string;
  courseid: string;
  roles: UserRole[];
}
