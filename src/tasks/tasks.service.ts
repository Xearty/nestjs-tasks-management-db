import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './entities/task/task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './enum/task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/entities/User/user.entity';
import { UserRole } from '../auth/enums/user-role.enum';

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
      const task: Task = await this.taskRepository.getTaskAsAdmin(id, user);
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
      const task: Task = await this.taskRepository.getTaskAsAdmin(id, user);
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
      const task: Task = await this.taskRepository.getTaskAsAdmin(id, user);
      if (!task)
        throw new NotFoundException('Task not found!');
      await this.taskRepository.update({ id: task.id }, { status: newStatus });
    } else {
      const affected: number = (await this.taskRepository.update({ id, userId: user.id }, { status: newStatus })).affected;
      if (!affected)
        throw new NotFoundException('Task not found!');
    }
  }
}
