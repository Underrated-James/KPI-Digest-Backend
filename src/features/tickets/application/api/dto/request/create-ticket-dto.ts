import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateTicketDto {

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
