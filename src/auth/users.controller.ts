import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from './entities/User/user.entity';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { GrantParamsDto } from './dto/grant-params.dto';

@Controller('users')
@UseGuards(AuthGuard())
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('grant')
  async grantRole(
    @Body() grantParamsDto: GrantParamsDto,
    @GetUser() user: User
  ): Promise<User> {
    return await this.usersService.grantRole(grantParamsDto, user);
  }

  @Post('revoke')
  async revokeRole(
    @Body() grantParamsDto: GrantParamsDto,
    @GetUser() user: User
  ): Promise<User> {
    return this.usersService.revokeRole(grantParamsDto, user);
  }

  @Get('myrole')
  async getMyRole(@GetUser() user: User): Promise< Record<string, unknown> > {
    const { password, salt, tasks, ...rest } = user;
    return { ...rest };
  }
}