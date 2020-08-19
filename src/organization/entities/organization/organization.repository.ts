import { EntityRepository, Repository } from 'typeorm';
import { Organization } from './organization.entity';
import { User } from '../../../auth/entities/User/user.entity';
import { OrganizationMember } from '../organization-member/organization-member.entity';
import { OrganizationMemberRole } from '../../enum/organization-member-role.enum';
import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateOrganizationDto } from '../../dto/create-organization.dto';
import { IOrganizationDetails } from '../../interfaces/organization-details.interface';

@EntityRepository(Organization)
export class OrganizationRepository extends Repository<Organization> {
  private readonly logger: Logger = new Logger('OrganizationRepository');

  async createOrganization(creator: User, createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
    const { name, type } = createOrganizationDto;

    const organization = Organization.create({ name, type });

    try {
      await organization.save();
    } catch(error) {
      switch (error.code) {
        case '23505': throw new ConflictException(`Organization name already taken!`);
        default: throw new InternalServerErrorException();
      }
    }

   await OrganizationMember.create({
      userId: creator.id,
      organizationId: organization.id,
      role: OrganizationMemberRole.MANAGER,
    }).save();

    this.logger.verbose(`${creator.username} created a new organization called ${organization.name}!`);

    return organization;
  }

  async getAllOrganizations(): Promise<Organization[]> {
    return await this.find();
  }

  async getOrganizationById(id: number): Promise<Organization> {
    return await this.findOne(id);
  }

  async getOrganizationByName(name: string): Promise<Organization> {
    return await this.findOne({ name });
  }

  async getOrganizationsThatUserIsIn(user: User): Promise<IOrganizationDetails[]> {
    return Promise.all((await user.memberships).map(async membership => {
      const { id, name, type } = await membership.organization;
      return { id, name, type, role: membership.role };
    }));
  }

  async userIsMemberOfOrganization(user: User, organization: Organization): Promise<boolean> {
    const organizationMember = await OrganizationMember.findOne({
      userId: user.id,
      organizationId: organization.id,
    });

    return Boolean(organizationMember);
  }

  async joinOrganization(user: User, organization: Organization): Promise<void> {
    await OrganizationMember.create({
      organizationId: organization.id,
      userId: user.id,
      role: OrganizationMemberRole.MEMBER,
    }).save();

    this.logger.verbose(`${user.username} joined an organization called ${organization.name}!`);
  }
}