import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../enum/task-status.enum';

export class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Invalid status!' })
  public status: TaskStatus;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public search: string;
}