import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRole } from './user-role.enum';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository
  ) {}

  async grantRole(userId: number, role: UserRole): Promise<User> {
    const user = await this.userRepository.findOne(userId);

    if (!user) {
      throw new UnauthorizedException(
        `A user with id ${userId} either doesn't exist or you are not allowed to alter their role!`
      );
    }
    // updating the user's role
    user.role = role;
    await user.save();

    // getting rid of the sensitive information
    delete user.password;
    delete user.salt;
    delete user.tasks;

    return user;
  }

  async revokeRole(userId: number, role: UserRole): Promise<User> {
    return await this.grantRole(userId, role);
  }
}