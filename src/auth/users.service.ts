import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { GrantParamsDto } from './dto/grant-params.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository
  ) {}

  async grantRole(grantParamsDto: GrantParamsDto): Promise<User> {
    const { userId, role } = grantParamsDto;
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

  async revokeRole(grantParamsDto: GrantParamsDto): Promise<User> {
    return await this.grantRole(grantParamsDto);
  }
}