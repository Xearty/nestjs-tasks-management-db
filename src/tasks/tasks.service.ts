import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';
import { UserRole } from '../auth/user-role.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private readonly taskRepository: TaskRepository,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]>  {
      return await this.taskRepository.getTasks(filterDto, user);
   }

  async getTaskById(id: number, user: User): Promise<Task> {
    if (user.role === UserRole.ADMIN) {
      const task: Task = await this.getTaskAsAdmin(id, user);
      if (!task)
        throw new NotFoundException('Task not found!');

      return task;
    }

    const task: Task = await this.taskRepository.findOne({ id, userId: user.id });
    if (!task)
      throw new NotFoundException('Task not found!');

    return task;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return await this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: number, user: User): Promise<void> {
    if (user.role === UserRole.ADMIN) {
      const task: Task = await this.getTaskAsAdmin(id, user);
      if (!task)
        throw new NotFoundException('Task not found!');
      await this.taskRepository.delete(task.id);
    } else {
      const affected: number = (await this.taskRepository.delete({ id, userId: user.id })).affected;
      if (!affected)
        throw new NotFoundException('Task not found!');
    }
  }

  async updateTaskStatus(id: number, newStatus: TaskStatus, user: User): Promise<void> {
    if (user.role === UserRole.ADMIN) {
      const task: Task = await this.getTaskAsAdmin(id, user);
      if (!task)
        throw new NotFoundException('Task not found!');
      await this.taskRepository.update({ id: task.id }, { status: newStatus });
    } else {
      const affected: number = (await this.taskRepository.update({ id, userId: user.id }, { status: newStatus })).affected;
      if (!affected)
        throw new NotFoundException('Task not found!');
    }
  }

  private async getTaskAsAdmin(id: number, user: User): Promise<Task> {
    const task: Task = await this.taskRepository
      .createQueryBuilder('task')
      .select(['task.*', 'user.id', 'user.role'])
      .innerJoin(User, 'user', 'user.id = task.userId')
      .where(`(task.id = :id) AND (user.role <> 'admin' OR task.userId = :userId)`,
        { id, userId: user.id })
      .select('task.*')
      .getRawOne();

    return task;
  }
}
