import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post, Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  @UsePipes(ValidationPipe)
  async getTasks(@Query() filterDto: GetTasksFilterDto): Promise<Task[]> {
    return await this.tasksService.getTasks(filterDto);
  }

  @Get(':id')
  async getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return await this.tasksService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.tasksService.createTask(createTaskDto);
  }

  @Delete(':id')
  async deleteTask(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.tasksService.deleteTask(id);
  }

  @Patch(':id/status')
  async updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus
  ): Promise<void> {
    await this.tasksService.updateTaskStatus(id, status);
  }
}

