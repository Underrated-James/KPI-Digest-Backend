import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  IsArray,
  IsOptional,
  ValidateNested,
  IsDateString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SprintStatus } from 'src/features/sprints/domain/enums/sprint-status-enums';
import { IsWithinRange } from 'src/common/decorators/is-within-range-decorator';
import { IsRealDate } from 'src/common/decorators/is-real-dates-decorator';
import { IsAfterStartDate } from 'src/common/decorators/is-after-start-decorator';

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

  @IsRealDate({ message: 'Start date must be a valid calendar date' })
  @IsNotEmpty()
  startDate: string;

  @IsOptional()
  @IsRealDate({ message: 'Official start date must be a valid calendar date' })
  officialStartDate?: string;

  @IsRealDate({ message: 'End date must be a valid calendar date' })
  @IsNotEmpty()
  @IsAfterStartDate('startDate')
  endDate: string;

  @IsOptional()
  @IsRealDate({ message: 'Official end date must be a valid calendar date' })
  @IsAfterStartDate('officialStartDate')
  officialEndDate?: string;

  @IsNumber()
  sprintDuration: number;

  @IsNumber()
  @Max(24, { message: 'Working hours per day must be less than or equal to 24' })
  workingHoursDay: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true }) 
  @Type(() => DayOffDto)
  @IsWithinRange('startDate')
  dayOff: DayOffDto[];
}


export class DayOffDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(2)
  label: string;

  @IsString()
  @IsNotEmpty()
  @IsRealDate({ message: 'Date must be a valid calendar date' })
  date: string;
}


