import { UserRoleType } from '../../user/schema/user.schema';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: [UserRoleType, ...UserRoleType[]]) =>
  SetMetadata(ROLES_KEY, roles);
