import { Controller } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}
/*

  @Get()
  getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Task[] {
    if (!Object.keys(filterDto).length) {
      return this.tasksService.getAllTasks();
    }
    return this.tasksService.getTasksWithFilters(filterDto);
  }

  @Get(':id')
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  createTask(@Body(ValidationPipe) createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto);
  }

  @Delete(':id')
  deleteTaskById(@Param('id') id: string): void {
    this.tasksService.deleteTaskById(id);
  }

  @Patch(':id/status')
  patchTask(@Param('id') id: string, @Body('status', TaskStatusValidationPipe) newStatus: TaskStatus): Task {
    return this.tasksService.patchTask(id, newStatus);
  }
*/
}

