import { Injectable, NotFoundException, ForbiddenException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { User } from '../auth/entities/User/user.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { Organization } from './entities/organization/organization.entity';
import { OrganizationRepository } from './entities/organization/organization.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { IOrganizationMemberDetails } from './interfaces/organization-member-details.interface';
import { IOrganizationDetails } from './interfaces/organization-details.interface';
import { UsersService } from 'src/auth/users.service';
import { OrganizationMemberRole } from './enum/organization-member-role.enum';
import { OrganizationMember } from './entities/organization-member/organization-member.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(OrganizationRepository)
    private readonly organizationRepository: OrganizationRepository,
    private readonly usersService: UsersService,
  ) {}

  async createOrganization(
    creator: User,
    createOrganizationDto: CreateOrganizationDto
  ): Promise<Organization> {
    return await this.organizationRepository.createOrganization(creator, createOrganizationDto);
  }

  async joinOrganization(user: User, orgIdentifier: string | number) {
    const organization = await this.getOrganization(orgIdentifier);
    if (await this.organizationRepository.userIsMemberOfOrganization(user, organization)) {
      throw new BadRequestException('You are already a member of this organization!');
    }
    this.organizationRepository.joinOrganization(user, organization);
  }

  // @TODO (Xearty) Can be optimized. Doing unnecessary queries to the database at the moment
  async kickMember(
    requester: User,
    orgIdentifier: string | number,
    userIdentifier: string | number
  ): Promise<Partial<User>> {
    const organization = await this.getOrganization(orgIdentifier);

    const userToKick = await this.usersService.getUser(userIdentifier);
    if (!userToKick) throw new NotFoundException('User not found!');

    const memberToKick = await this.getOrganizationMember(userToKick, organization);
    if (!memberToKick)
      throw new NotFoundException('The user is not a member of this organization!');

    const requesterMember = await this.getOrganizationMember(requester, organization);

    if (memberToKick.role === OrganizationMemberRole.MANAGER
      || requesterMember.role === OrganizationMemberRole.MEMBER)
      throw new UnauthorizedException('You are unauthorized to kick this member!');

    const { password, salt, ...details } = await memberToKick.user;

    await memberToKick.remove();

    return details;
  }

  // @TODO (Xearty) Can be optimized. Doing unnecessary queries to the database at the moment
  async promoteToManager(
    promoter: User,
    promoteeIdentifier: string | number,
    orgIdentifier: string | number
  ): Promise<IOrganizationMemberDetails> {
    const organization = await this.getOrganization(orgIdentifier);
    const promoterMember = await this.getOrganizationMember(promoter, organization);

    if (!promoterMember)
      throw new ForbiddenException('You are not a member of this organization!');

    if (promoterMember.role === OrganizationMemberRole.MEMBER)
      throw new UnauthorizedException("You don't have access to this function!");

    const promotee = await this.usersService.getUser(promoteeIdentifier);
    if (!promotee)
      throw new NotFoundException("The user doesn't exist!");

    const promoteeMember = await this.getOrganizationMember(promotee, organization);
    if (!promoteeMember)
      throw new NotFoundException('The promotee is not a member of this organization!');

    if (promoteeMember.role === OrganizationMemberRole.MANAGER)
      throw new ForbiddenException('The member is already a manager!');

    promoteeMember.role = OrganizationMemberRole.MANAGER;
    await promoteeMember.save();

    return {
      id: promotee.id,
      username: promotee.username,
      role: promoteeMember.role,
    };
  }

  async getAllOrganizations(): Promise<Organization[]> {
    return await this.organizationRepository.getAllOrganizations();
  }

  async getOrganizationsThatUserIsIn(user: User): Promise<IOrganizationDetails[]> {
    return await this.organizationRepository.getOrganizationsThatUserIsIn(user);
  }

  async getOrganizationMembers(
    user: User,
    orgIdentifier: string | number
  ): Promise<IOrganizationMemberDetails[]> {
    const organization = await this.getOrganization(orgIdentifier);

    if (await this.organizationRepository.userIsMemberOfOrganization(user, organization)) {
      return Promise.all((await organization.members).map(async member => {
        const { id, username } = await member.user;
        return { id, username, role: member.role };
      }));
    } else {
      throw new ForbiddenException("You can't access this organization's members!");
    }
  }

  async getOrganizationById(id: number): Promise<Organization> {
    const organization = await this.organizationRepository.getOrganizationById(id);
    if (!organization)
      throw new NotFoundException('Organization not found!');

    return organization;
  }

  async getOrganizationByName(name: string): Promise<Organization> {
    const organization = await this.organizationRepository.getOrganizationByName(name)
    if (!organization)
      throw new NotFoundException('Organization not found!');

    return organization;
  }
  
  async getOrganization(identifier: string | number) {
    if (typeof identifier === 'number') {
      return await this.getOrganizationById(identifier);
    } else {
      return await this.getOrganizationByName(identifier);
    }
  }

  async getOrganizationMember(
    user: User,
    organization: Organization
  ): Promise<OrganizationMember> {
    return await OrganizationMember.findOne({
      userId: user.id,
      organizationId: organization.id
    });
  }
}
