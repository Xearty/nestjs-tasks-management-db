import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository
  ) {}

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]>  {
      return await this.taskRepository.getTasks(filterDto);
   }

  async getTaskById(id: number): Promise<Task> {
    const task: Task | undefined = await this.taskRepository.findOne(id);
    if (!task)
      throw new NotFoundException('Task not found!');

    return task;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskRepository.createTask(createTaskDto);
  }

  async deleteTask(id: number): Promise<void> {
    const { affected } = await this.taskRepository.delete(id);
    if (!affected)
      throw new NotFoundException(`Task with id ${id} not found!`);
  }

  async updateTaskStatus(id: number, newStatus: TaskStatus): Promise<void> {
    const { affected } = await this.taskRepository.update({ id: id }, { status: newStatus });
    if (!affected)
      throw new NotFoundException(`Task with id ${id} not found!`);
  }
}
