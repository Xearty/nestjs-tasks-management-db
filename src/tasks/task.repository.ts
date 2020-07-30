import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');

  async getTasks(filterDto: GetTasksFilterDto, user: User ): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where({ userId: user.id });
    
    if (status)
      query.andWhere('task.status = :status', { status });

    if (search)
      query.andWhere('(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` });

    try {
      return await query.getMany();
    } catch(error) {
      this.logger.error(
        `Failed to get tasks for user "${user.username}". Filters: ${JSON.stringify(filterDto)}`,
        error.stack
      );
      throw new InternalServerErrorException();
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task: Task = new Task();
    task.title = title;
    task.description = description;
    task.user = user;

    try {
      await task.save();
    } catch(error) {
      this.logger.error(
        `Failed to create a task for user "${user.username}". Data: ${JSON.stringify(createTaskDto)}`,
        error.stack
      );
    }
    // deleting the user property because it contains sensitive information
    // and we are responding with the task object
    delete task.user;
    return task;
  }

  async getTaskAsAdmin(id: number, user: User): Promise<Task> {
    return await this.createQueryBuilder('task')
      .select(['task.*', 'user.id', 'user.role'])
      .innerJoin(User, 'user', 'user.id = task.userId')
      .where(`(task.id = :id) AND (user.role <> 'admin' OR task.userId = :userId)`,
        { id, userId: user.id })
      .select('task.*')
      .getRawOne();
  }
}
