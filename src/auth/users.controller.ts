import { Body, Controller, Get, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { GrantParamsDto } from './dto/grant-params.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('grant')
  async grantRole(@Body() grantParamsDto: GrantParamsDto): Promise<User> {
    return this.usersService.grantRole(grantParamsDto);
  }

  @Post('revoke')
  async revokeRole(@Body() grantParamsDto: GrantParamsDto): Promise<User> {
    return this.usersService.revokeRole(grantParamsDto);
  }

  @Get('myrole')
  @UseGuards(AuthGuard())
  async getMyRole(@GetUser() user: User): Promise< Record<string, unknown> > {
    const { password, salt, tasks, ...rest } = user;
    return { ...rest };
  }
}