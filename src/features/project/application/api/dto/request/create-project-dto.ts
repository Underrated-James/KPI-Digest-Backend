import {
  ArrayUnique,
  IsArray,
  IsDate,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
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

  @IsString()
  @IsNotEmpty({ message: 'Project code is required' })
  @MaxLength(10, { message: 'Project code is too long (max 10 characters)' })
  @MinLength(2, { message: 'Project code is too short (min 2 characters)' })
  projectCode: string;

  @Type(() => Date)
  @IsDate()
  finishDate: Date;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsMongoId({ each: true })
  memberIds?: string[];
}
