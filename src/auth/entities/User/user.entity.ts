import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Task } from '../../../tasks/entities/task/task.entity';
import { UserRole } from '../../enums/user-role.enum';
import { OrganizationMember } from '../../../organization/entities/organization-member/organization-member.entity';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number

  @Column()
  public username!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER
  })
  public role!: UserRole;

  @Column()
  public password!: string;

  @Column()
  public salt!: string;

  @OneToMany(type => Task, task => task.user, { eager: true })
  public tasks!: Task[];

  @OneToMany(type => OrganizationMember, organizationMember => organizationMember.user)
  public memberships!: Promise<OrganizationMember[]>;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return this.password === hash;
  }
}