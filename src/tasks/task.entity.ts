import { TaskStatus } from './task-status.enum';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../auth/user.entity';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column()
  public description: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.OPEN
  })
  public status: TaskStatus;

  @Column()
  public userId: number;

  @ManyToOne(type => User, user => user.tasks, { eager: false })
  public user: User;
}