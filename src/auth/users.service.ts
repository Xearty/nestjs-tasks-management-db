import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/User/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './entities/User/user.repository';
import { GrantParamsDto } from './dto/grant-params.dto';
import { AuthorizationService } from './authorization.service';
import { UserRole } from './enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly authorizationService: AuthorizationService,
  ) {}

  async grantRole(grantParamsDto: GrantParamsDto, modifier: User): Promise<User> {
    if (modifier.role === UserRole.USER)
      throw new UnauthorizedException('Users don\'t have access to grant!');

    const { userId, role } = grantParamsDto;
    const target = await this.userRepository.findOne(userId);

    if (target && this.authorizationService.canGrantRole(modifier, target, role))
      return await this.userRepository.modifyRoleAndGetUser(target, role);
    else
      throw new UnauthorizedException(
        `A user with id ${userId} either doesn't exist or you are not allowed to alter their role!`
      );
  }

  async revokeRole(grantParamsDto: GrantParamsDto, modifier: User): Promise<User> {
    if (modifier.role === UserRole.USER)
      throw new UnauthorizedException('Users don\'t have access to revoke!');

    const { userId, role } = grantParamsDto;
    const target = await this.userRepository.findOne(userId);

    if (target && await this.authorizationService.canRevokeRole(modifier, target, role))
      return await this.userRepository.modifyRoleAndGetUser(target, role);
    else
      throw new UnauthorizedException(
        `A user with id ${userId} either doesn't exist or you are not allowed to alter their role!`
      );
  }

  async getUserById(id: number): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  async getUserByName(username: string): Promise<User> {
    return await this.userRepository.findOne({ username });
  }

  async getUser(identifier: string | number): Promise<User> {
    if (typeof identifier === 'number') {
      return await this.getUserById(identifier);
    } else {
      return await this.getUserByName(identifier);
    }
  }
}