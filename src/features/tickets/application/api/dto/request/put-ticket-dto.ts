import { Prop } from '@nestjs/mongoose';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PutTicketDto {


    @IsString()
    @IsNotEmpty({ message: 'Ticket number is required' })
    @Prop({
        unique: true,
        required: [true, 'Ticket number is required']
    })
    ticketNumber: string;

    @IsNotEmpty({ message: 'Ticket title is required' })
    @IsString()
    @Prop({
        required: [true, 'Ticket title is required']
    })
    ticketTitle: string;

    @IsNotEmpty({ message: 'Description link is required' })
    @IsString()
    @Prop({
        required: [true, 'Description link is required']
    })
    descriptionLink: string;

    @IsNotEmpty({ message: 'Estimation testing is required' })
    @IsNumber()
    @Prop({
        required: [true, 'Estimation testing is required']
    })
    estimationTesting: number;

    @IsNotEmpty({ message: 'Development estimation is required' })
    @IsNumber()
    @Prop({
        required: [true, 'Development estimation is required']
    })
    developmentEstimation: number;
}
