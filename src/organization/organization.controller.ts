import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, HttpCode, BadRequestException, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrganizationService } from './organization.service';
import { User } from '../auth/entities/User/user.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { Organization } from './entities/organization/organization.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { IOrganizationMemberDetails } from './interfaces/organization-member-details.interface';
import { IOrganizationDetails } from './interfaces/organization-details.interface';
import { UserIdentifierDto } from './dto/user-identifier.dto';

@Controller('organization')
@UseGuards(AuthGuard())
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post('create')
  async createOrganization(
    @GetUser() creator: User,
    @Body() createOrganizationDto: CreateOrganizationDto
  ): Promise<Organization> {
    return await this.organizationService.createOrganization(creator, createOrganizationDto);
  }

  @Post('join/name/:name')
  @HttpCode(204)
  async joinOrganizationByName(
    @GetUser() user: User,
    @Param('name') orgName: string
  ): Promise<void> {
    return await this.organizationService.joinOrganization(user, orgName);
  }

  @Post('join/id/:id')
  @HttpCode(204)
  async joinOrganizationById(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) orgId: number
  ): Promise<void> {
    return await this.organizationService.joinOrganization(user, orgId);
  }

  @Post('kick/name/:name')
  async kickMemberByOrganizationName(
    @GetUser() requester: User,
    @Param('name') orgName: string,
    @Body() userIdentifierDto: UserIdentifierDto
  ): Promise<Partial<User>> {
    this.validateUserIdendifierDto(userIdentifierDto);
    const { id, username } = userIdentifierDto;
    return await this.organizationService.kickMember(requester, orgName, username || id);
  }

  @Post('kick/id/:id')
  async kickMemberByOrganizationId(
    @GetUser() requester: User,
    @Param('id', ParseIntPipe) orgId: number,
    @Body() userIdentifierDto: UserIdentifierDto
  ): Promise<Partial<User>> {
    this.validateUserIdendifierDto(userIdentifierDto);
    const { id, username } = userIdentifierDto;
    return await this.organizationService.kickMember(requester, orgId, username || id);
  }

  @Patch('promote/name/:name')
  async promoteToManagerByOrganizationName(
    @GetUser() promoter: User,
    @Param('name') orgName: string,
    @Body() userIdentifierDto: UserIdentifierDto
  ): Promise<IOrganizationMemberDetails> {
    this.validateUserIdendifierDto(userIdentifierDto);
    const { username, id } = userIdentifierDto;
    return await this.organizationService.promoteToManager(promoter, username || id, orgName);
  }

  @Patch('promote/id/:id')
  async promoteToManagerById(
    @GetUser() promoter: User,
    @Param('id', ParseIntPipe) orgId: number,
    @Body() userIdentifierDto: UserIdentifierDto
  ): Promise<IOrganizationMemberDetails> {
    this.validateUserIdendifierDto(userIdentifierDto);
    const { username, id } = userIdentifierDto;
    return await this.organizationService.promoteToManager(promoter, username || id, orgId);
  }

  @Get('get/all')
  async getAllOrganizations(): Promise<Organization[]> {
    return this.organizationService.getAllOrganizations();
  }

  @Get('get/name/:name')
  async getOrganizationByName(@Param('name') name: string): Promise<Organization> {
    return await this.organizationService.getOrganizationByName(name);
  }

  @Get('get/id/:id')
  async getOrganizationById(@Param('id', ParseIntPipe) id: number): Promise<Organization> {
    return await this.organizationService.getOrganizationById(id);
  }

  @Get('get/membership')
  async getOrganizationsThatUserIsIn(@GetUser() user: User): Promise<IOrganizationDetails[]> {
    return await this.organizationService.getOrganizationsThatUserIsIn(user);
  }

  @Get('get/members/name/:name')
  async getOrganizationMembersByName(
    @GetUser() user: User,
    @Param('name') orgName: string
  ): Promise<IOrganizationMemberDetails[]> {
    return await this.organizationService.getOrganizationMembers(user, orgName);
  }

  @Get('get/members/id/:id')
  async getOrganizationMembersById(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) orgId: number
  ): Promise<IOrganizationMemberDetails[]> {
    return await this.organizationService.getOrganizationMembers(user, orgId);
  }

  private validateUserIdendifierDto(userIdentifierDto: UserIdentifierDto): void {
    const { username, id } = userIdentifierDto;
    if (username === undefined && id === undefined)
      throw new BadRequestException('You should provide username or id!');

    if (username !== undefined && id !== undefined)
      throw new BadRequestException('You sould provide either username or id, not both!');
  }
}
