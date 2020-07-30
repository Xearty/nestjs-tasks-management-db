import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './user.entity';
import { UserRole } from './user-role.enum';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthorizationService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  readonly precedence = {
    [UserRole.ADMIN]: 1,
    [UserRole.USER]: 0,
  };

  canGrantRole(modifier: User, target: User, role: UserRole): boolean {
    if (modifier.id === target.id)
      throw new UnauthorizedException("You can't grant yourself a role!");

    if (this.precedence[role] <= this.precedence[target.role])
      throw new UnauthorizedException('The role specified is too low');

    if (target.role === role)
      throw new UnauthorizedException('The user already has this role!');

    return (
      this.precedence[modifier.role] > this.precedence[target.role]
      && this.precedence[role] < this.precedence[modifier.role]
    )
  }

  async canRevokeRole(modifier: User, target: User, role: UserRole): Promise<boolean> {
    if (target.role === role)
      throw new UnauthorizedException('The user already has this role!');

    if (modifier.id === target.id) {
      const adminCount: number = await this.userRepository.count({ role: UserRole.ADMIN });
      if (adminCount === 1)
        throw new UnauthorizedException("The user's role cannot be revoked because they are the only admin left!");
      else
        return true;
    }

    if (this.precedence[role] > this.precedence[target.role])
      throw new UnauthorizedException('The role specified is too high!');

    return this.precedence[modifier.role] > this.precedence[target.role];
  }
}