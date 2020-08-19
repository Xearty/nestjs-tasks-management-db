import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { OrganizationMemberRole } from '../../enum/organization-member-role.enum';
import { User } from '../../../auth/entities/User/user.entity';
import { Organization } from '../organization/organization.entity';

@Entity()
export class OrganizationMember extends BaseEntity {
  @PrimaryColumn()
  public userId!: number;

  @PrimaryColumn()
  public organizationId!: number;

  @Column()
  public role!: OrganizationMemberRole;

  @ManyToOne(type => User, user => user.memberships)
  public user!: Promise<User>;

  @ManyToOne(type => Organization, organization => organization.members)
  public organization!: Promise<Organization>;
}