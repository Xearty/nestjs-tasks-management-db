import { OrganizationType } from '../enum/organization-type.enum';
import { IsEnum, IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateOrganizationDto {
  @Matches(/\b\w+\b( \b\w+\b)*/, { message: 'A name should consist of only word and letter characters!'})
  @Matches(/^[a-z].*$/i, { message: 'An organization name must start with a letter' })
  @MinLength(2)
  @MaxLength(32)
  @IsNotEmpty()
  public name: string;

  @IsEnum(OrganizationType, { message: 'Invalid organization type' })
  @IsNotEmpty()
  public type: OrganizationType;
}
