import { UserRole } from '../enums/user-role.enum';
import { IsEnum, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class GrantParamsDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  public userId: number;

  @IsNotEmpty()
  @IsEnum(UserRole, { message: 'Not a valid role! '})
  public role: UserRole;
}