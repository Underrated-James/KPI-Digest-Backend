import { IsNotEmpty, IsString, IsNumber, IsArray, ValidateNested, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { SprintStatus } from 'src/features/sprints/domain/enums/sprint-status-enums';
import { UserRole } from 'src/features/users/domain/enums/user-role.enum';
import { TicketStatus } from 'src/features/tickets/domain/enums/ticket-status';

export class TeamAllocationSummaryDto {
  @IsNumber()
  totalCapacity: number;

  @IsNumber()
  totalCommitted: number;

  @IsNumber()
  totalAvailable: number;

  @IsNumber()
  totalSpent: number;

  @IsNumber()
  utilization: number;
}

export class DayStatusDto {
  @IsDateString()
  date: Date;

  @IsString()
  status: string;
}

export class MemberMetricDto {
  @IsString()
  userId: string;

  @IsString()
  name: string;

  @IsEnum(UserRole)
  role: string;

  @IsNumber()
  rhythm: number;

  @IsNumber()
  sprintCapacity: number;

  @IsNumber()
  committedCapacity: number;

  @IsNumber()
  availableCapacity: number;

  @IsNumber()
  timeSpent: number;

  @IsNumber()
  utilization: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DayStatusDto)
  leaveTimeline: DayStatusDto[];
}

export class TicketDto {
  @IsString()
  id: string;

  @IsString()
  ticketNumber: string;

  @IsString()
  title: string;

  @IsEnum(TicketStatus)
  status: string;

  @IsString()
  devName: string;

  @IsString()
  qaName: string;

  @IsNumber()
  devEstimate: number;

  @IsNumber()
  qaEstimate: number;

  @IsNumber()
  devSpent: number;

  @IsNumber()
  qaSpent: number;
}

export class SprintHolidayDto {
  @IsString()
  name: string;

  @IsDateString()
  date: Date;
}

export class CreateSprintOverviewDto {
  @IsNotEmpty()
  @IsString()
  projectId: string;

  @IsNotEmpty()
  @IsString()
  projectName: string;

  @IsNotEmpty()
  @IsString()
  sprintId: string;

  @IsNotEmpty()
  @IsString()
  sprintName: string;

  @IsEnum(SprintStatus)
  sprintStatus: string;

  @IsString()
  planningStatus: string;

  @IsDateString()
  planningStart: Date;

  @IsDateString()
  planningEnd: Date;

  @IsNumber()
  workingDays: number;

  @IsOptional()
  @IsDateString()
  actualStart: Date | null;

  @IsOptional()
  @IsDateString()
  actualEnd: Date | null;

  @IsNumber()
  teamRhythm: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SprintHolidayDto)
  holidays: SprintHolidayDto[];

  @IsNotEmpty()
  @IsString()
  teamId: string;

  @IsDateString()
  finalizedAt: Date;

  @IsString()
  finalizedBy: string;

  @ValidateNested()
  @Type(() => TeamAllocationSummaryDto)
  summary: TeamAllocationSummaryDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemberMetricDto)
  memberMetrics: MemberMetricDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketDto)
  sprintTickets: TicketDto[];
}
