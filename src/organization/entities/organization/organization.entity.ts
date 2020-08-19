import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { OrganizationType } from '../../enum/organization-type.enum';
import { OrganizationMember } from '../organization-member/organization-member.entity';

@Entity()
@Unique(['name'])
export class Organization extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public name!: string;

  @Column({
    type: 'enum',
    enum: OrganizationType,
  })
  public type!: OrganizationType;

  @OneToMany(type => OrganizationMember, member => member.organization)
  public members!: Promise<OrganizationMember[]>;
}