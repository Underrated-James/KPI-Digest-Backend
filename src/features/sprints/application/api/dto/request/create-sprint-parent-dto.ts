import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SprintStatus } from 'src/features/sprints/domain/enums/sprint-status-enums';
import { DayOffDto } from './child/create-sprint-child-dto';

// The Main Sprint DTO
export class CreateSprintDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  status: SprintStatus;

  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @IsNumber()
  @Max(24, { message: 'Working hours per day must be less than or equal to 24' })
  workingHoursDay: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true }) 
  @Type(() => DayOffDto)
  dayOff: DayOffDto[];
}