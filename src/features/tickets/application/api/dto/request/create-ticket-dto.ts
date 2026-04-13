import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTicketDto {

    @IsNotEmpty()
    @IsString()
    projectId: string;

    @IsOptional()
    @IsString()
    sprintId?: string;

    @IsOptional()
    @IsString()
    teamId?: string;

    @IsOptional()
    @IsString()
    assignedDevId?: string;

    @IsOptional()
    @IsString()
    assignedQaId?: string;

    @IsString()
    @IsNotEmpty({ message: 'Ticket number is required' })
    ticketNumber: string;

    @IsNotEmpty({ message: 'Ticket title is required' })
    @IsString()
    ticketTitle: string;

    @IsNotEmpty({ message: 'Description link is required' })
    @IsString()
    descriptionLink: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    estimationTesting?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    developmentEstimation?: number;
}
