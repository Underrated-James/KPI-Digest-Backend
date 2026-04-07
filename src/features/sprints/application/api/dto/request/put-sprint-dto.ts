import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  MaxLength,
  MinLength,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SprintStatus } from 'src/features/sprints/domain/enums/sprint-status-enums';
import { DayOffDto } from './create-sprint-parent-dto';
import { IsWithinRange } from 'src/common/decorators/is-within-range-decorator';
import { IsRealDate } from 'src/common/decorators/is-real-dates-decorator';
import { IsAfterStartDate } from 'src/common/decorators/is-after-start-decorator';

export class PutSprintDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(50, { message: 'Project name is too long (max 50 characters)' })
  @MinLength(2, { message: 'Project name is too short (min 2 characters)' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Status is required' })
  status: SprintStatus;

  @IsRealDate({ message: 'Start date must be a valid calendar date' })
  @IsNotEmpty()
  startDate: string;

  @IsRealDate({ message: 'End date must be a valid calendar date' })
  @IsNotEmpty()
  @IsAfterStartDate('startDate')
  endDate: string;

  @IsOptional()
  @IsRealDate({ message: 'Official start date must be a valid calendar date' })
  officialStartDate?: string;

  @IsOptional()
  @IsRealDate({ message: 'Official end date must be a valid calendar date' })
  @IsAfterStartDate('officialStartDate')
  officialEndDate?: string;

  @IsNumber()
  @IsNotEmpty()
  sprintDuration: number;

  @IsNumber({}, { message: 'Working hours must be a valid number' })
  @IsNotEmpty({ message: 'Working hours are required' })
  @Min(0, { message: 'Working hours cannot be negative' })
  @Max(24, {
    message: 'Working hours cannot exceed $constraint1 hours per day',
  })
  workingHoursDay: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => DayOffDto)
  @IsWithinRange('startDate')
  dayOff: DayOffDto[];

  @IsOptional()
  isDeleted?: boolean;

  @IsOptional()
  deletedAt?: string;
}


