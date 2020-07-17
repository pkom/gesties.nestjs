import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums/user.roles';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
