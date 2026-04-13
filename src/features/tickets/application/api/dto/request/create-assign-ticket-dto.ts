import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAssignTicketDto {

    @IsNotEmpty()
    @IsString()
    projectId: string;

    @IsNotEmpty()
    @IsString()
    sprintId: string;

    @IsNotEmpty()
    @IsString()
    teamId: string;

    @IsNotEmpty()
    @IsString()
    assignedDevId: string;

    @IsNotEmpty()
    @IsString()
    assignedQaId: string;

    @IsString()
    @IsNotEmpty({ message: 'Ticket number is required' })
    ticketNumber: string;

    @IsNotEmpty({ message: 'Ticket title is required' })
    @IsString()
    ticketTitle: string;

    @IsNotEmpty({ message: 'Description link is required' })
    @IsString()
    descriptionLink: string;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    estimationTesting: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    developmentEstimation: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    sprintCapacity: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    commitedCapacity: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    availableCapacity: number;
}
