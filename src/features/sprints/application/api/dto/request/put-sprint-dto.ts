import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SprintStatus } from 'src/features/sprints/domain/enums/sprint-status-enums';

export class PutSprintDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(50, { message: 'Project name is too long (max 50 characters)' })
  @MinLength(2, { message: 'Project name is too short (min 2 characters)' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Status is required' })
  status: SprintStatus;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  endDate: Date;

  @IsNumber({}, { message: 'Working hours must be a valid number' })
  @IsNotEmpty({ message: 'Working hours are required' })
  @Min(0, { message: 'Working hours cannot be negative' })
  @Max(24, {
    message: 'Working hours cannot exceed $constraint1 hours per day',
  })
  workingHoursDay: number;
}
