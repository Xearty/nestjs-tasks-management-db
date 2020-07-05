import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository
  ) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]>  {
      return await this.taskRepository.getTasks(filterDto, user);
   }

  async getTaskById(id: number, user: User): Promise<Task> {
    const task: Task = await this.taskRepository.findOne({ where: { id, userId: user.id } });
    if (!task)
      throw new NotFoundException('Task not found!');

    return task;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return await this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: number, user: User): Promise<void> {
    const { affected } = await this.taskRepository.delete({ id, userId: user.id });
    if (!affected)
      throw new NotFoundException(`Task with id ${id} not found!`);
  }

  async updateTaskStatus(id: number, newStatus: TaskStatus, user: User): Promise<void> {
    const { affected } = await this.taskRepository.update({ id, userId: user.id }, { status: newStatus });
    if (!affected)
      throw new NotFoundException(`Task with id ${id} not found!`);
  }
}
