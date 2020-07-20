import { BadRequestException, PipeTransform } from '@nestjs/common';
import { UserRole } from '../user-role.enum';

export class UserRoleValidationPipe implements PipeTransform {
  readonly allowedUserRoles: UserRole[] = [
    UserRole.ADMIN,
    UserRole.USER,
  ];

  transform(value: unknown): UserRole {
    if (!this.isValidRole(value))
      throw new BadRequestException(`The value ${value} is an invalid role`);

    return value;
  }

  private isValidRole(role: any): role is UserRole {
    return this.allowedUserRoles.indexOf(role) !== -1;
  }
}
