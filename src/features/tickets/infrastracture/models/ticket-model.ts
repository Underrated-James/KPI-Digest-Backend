import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TICKET_COLLECTION } from '../../domain/constants/ticket.constants';
import { TicketStatus } from '../../domain/enums/ticket-status';

export type TicketDocument = HydratedDocument<TicketModel>;

@Schema({ collection: TICKET_COLLECTION, timestamps: true })
export class TicketModel {

    @Prop({
        unique: true,
        required: true,
    })
    ticketNumber: string;

    @Prop({
        required: true,
        enum: TicketStatus,
    })
    ticketStatus: TicketStatus;

    @Prop({
        required: true,
    })
    ticketTitle: string;

    @Prop({
        required: true,
    })
    descriptionLink: string;

    @Prop({
        required: true,
    })
    estimationTesting: number;

    @Prop({
        required: true,
    })
    developmentEstimation: number;

    @Prop({
        required: true,
    })
    createdAt: Date;

    @Prop({
        required: true,
    })
    updatedAt: Date;
}

export const TicketSchema = SchemaFactory.createForClass(TicketModel);
