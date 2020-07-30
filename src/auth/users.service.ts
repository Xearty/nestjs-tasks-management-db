import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { GrantParamsDto } from './dto/grant-params.dto';
import { AuthorizationService } from './authorization.service';
import { UserRole } from './user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private authorizationService: AuthorizationService,
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
}