import { IsNotEmpty, IsNumber, IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class TeamUserCapacityDto {
  @IsNotEmpty()
  @IsString()
  userIdOfTeam: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  userSprintCapacity: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  userCommitedCapacity: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  userAvailableCapacity: number;
}

export class TicketAssignItemDto {
  @IsNotEmpty()
  @IsString()
  ticketId: string;

  @IsOptional()
  @IsString()
  assignedDevId?: string;

  @IsOptional()
  @IsString()
  assignedQaId?: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  estimationTesting: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  developmentEstimation: number;

  // Optional: The backend already has these if the ticket exists, 
  // but included here if you want to update them during assignment.
  @IsOptional()
  @IsString()
  ticketNumber?: string;

  @IsOptional()
  @IsString()
  ticketTitle?: string;
}

export class BulkAssignTicketsDto {
  @IsNotEmpty()
  @IsString()
  projectId: string;

  @IsNotEmpty()
  @IsString()
  sprintId: string;

  @IsNotEmpty()
  @IsString()
  teamId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeamUserCapacityDto)
  allUsersOfTeam: TeamUserCapacityDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketAssignItemDto)
  tickets: TicketAssignItemDto[];
}
