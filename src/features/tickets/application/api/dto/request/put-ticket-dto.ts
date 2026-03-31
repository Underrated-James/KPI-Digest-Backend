import { IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';
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
    assignedUserId?: string;

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
    @IsNumber()
    estimationTesting: number;

    @IsNotEmpty({ message: 'Development estimation is required' })
    @IsNumber()
    developmentEstimation: number;
}
