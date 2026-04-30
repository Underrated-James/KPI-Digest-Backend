import { IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { TicketStatus } from 'src/features/tickets/domain/enums/ticket-status';


export class PutTicketDto {

    @IsNotEmpty()
    @IsString()
    projectId: string;

    @IsOptional()
    @IsString()
    sprintId?: string;

    @IsOptional()
    @IsString()
    assignedDevId?: string;

    @IsOptional()
    @IsString()
    assignedQaId?: string;

    @IsString()
    @IsNotEmpty({ message: 'Ticket number is required' })
    ticketNumber: string;

    @IsEnum(TicketStatus)
    @IsNotEmpty({ message: 'Status is required' })
    status: TicketStatus;

    @IsNotEmpty({ message: 'Ticket title is required' })
    @IsString()
    ticketTitle: string;

    @IsNotEmpty({ message: 'Description link is required' })
    @IsString()
    descriptionLink: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    estimationTesting?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    developmentEstimation?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    devTimeSpent?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    testingTimeSpent?: number;
}
