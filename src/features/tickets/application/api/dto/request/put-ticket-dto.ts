import { IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { TicketStatus } from 'src/features/tickets/domain/enums/ticket-status';


export class PutTicketDto {

    @IsNotEmpty()
    @IsString()
    projectId: string;

    @IsNotEmpty()
    @IsString()
    sprintId: string;

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

    @IsNotEmpty({ message: 'Estimation testing is required' })
    @Type(() => Number)
    @IsNumber()
    estimationTesting: number;

    @IsNotEmpty({ message: 'Development estimation is required' })
    @Type(() => Number)
    @IsNumber()
    developmentEstimation: number;
}
