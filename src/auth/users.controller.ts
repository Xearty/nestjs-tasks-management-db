import { Body, Controller, Get, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { UserRoleValidationPipe } from './pipes/user-role-validation.pipe';
import { UserRole } from './user-role.enum';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('grant')
  async grantRole(
    @Body('userId', ParseIntPipe) userId,
    @Body('role', UserRoleValidationPipe) role: UserRole
  ): Promise<User> {
    return this.usersService.grantRole(userId, role);
  }

  @Post('revoke')
  async revokeRole(
    @Body('userId', ParseIntPipe) userId: number,
    @Body('role', UserRoleValidationPipe) role: UserRole
  ): Promise<User> {
    return this.usersService.revokeRole(userId, role);
  }

  @Get('myrole')
  @UseGuards(AuthGuard())
  async getMyRole(@GetUser() user: User): Promise< Record<string, unknown> > {
    const { password, salt, tasks, ...rest } = user;
    return { ...rest };
  }
}