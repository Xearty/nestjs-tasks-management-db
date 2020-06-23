import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
/*
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    let filteredTasks: Task[] = this.tasks;
    if (filterDto.status) {
      filteredTasks = filteredTasks.filter(task => task.status === filterDto.status);
    }
    if (filterDto.search) {
      filteredTasks = filteredTasks.filter(task =>
        task.description.includes(filterDto.search) ||
        task.title.includes(filterDto.search)
      );
    }
    return filteredTasks;
  }

  getTaskById(id: string): Task {
    return this.findTaskById(id)[1];
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title: title,
      description: description,
      status: TaskStatus.OPEN
    };
    this.tasks.push(task);
    return task;
  }

  deleteTaskById(id: string): void {
    const index = this.findTaskById(id)[0];
    this.tasks.splice(index, 1);
  }

  patchTask(id: string, newStatus: TaskStatus): Task {
    const task = this.findTaskById(id)[1];
    task.status = newStatus;
    return task;
  }

  private findTaskById(id: string): [number, Task] {
    const index: number = this.tasks.findIndex((task) => task.id === id);
    const task = this.tasks[index];
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found!`);
    }
    return [ index, task ];
  }
*/
}
