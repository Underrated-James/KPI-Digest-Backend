import { IsDate, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ProjectStatus } from '../../../../domain/enums/project-status-enums';
import { Type } from 'class-transformer';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(50, { message: 'Project name is too long (max 50 characters)' })
  @MinLength(2, { message: 'Project name is too short (min 2 characters)' })
  name: string;

  @IsEnum(ProjectStatus)
  status: ProjectStatus;

  @Type(() => Date)
  @IsDate()
  finishDate: Date;
}
