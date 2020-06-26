import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  public status: TaskStatus;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public search: string;
}