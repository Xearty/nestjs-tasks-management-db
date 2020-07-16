import {
  Body,
  Controller,
  Delete,
  Get, Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post, Query, UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TaskController');
  constructor(private tasksService: TasksService) {}

  @Get()
  async getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User
  ): Promise<Task[]> {
    this.logger.verbose(`User ${user.username} retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`)
    return await this.tasksService.getTasks(filterDto, user);
  }

  @Get(':id')
  async getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User
  ): Promise<Task> {
    return await this.tasksService.getTaskById(id, user);
  }

  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User
  ): Promise<Task> {
    this.logger.verbose(`User "${user.username}" creating a new task. Data: ${JSON.stringify(createTaskDto)}`)
    return await this.tasksService.createTask(createTaskDto, user);
  }

  @Delete(':id')
  async deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User
  ): Promise<void> {
    return await this.tasksService.deleteTask(id, user);
  }

  @Patch(':id/status')
  async updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User
  ): Promise<void> {
    await this.tasksService.updateTaskStatus(id, status, user);
  }
}

