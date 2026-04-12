import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TICKET_COLLECTION } from '../../domain/constants/ticket.constants';
import { TicketStatus } from '../../domain/enums/ticket-status';

export type TicketDocument = HydratedDocument<TicketModel>;

@Schema({ collection: TICKET_COLLECTION, timestamps: true })
export class TicketModel {

    @Prop({ required: true, index: true })
    projectId: string;

    @Prop({ required: true, index: true })
    sprintId: string;

    @Prop({ type: String, required: false, index: true, default: null }) 
    teamId: string | null;

    @Prop({ type: String, required: false, index: true, default: null }) 
    assignedDevId: string | null;

    @Prop({ type: String, required: false, index: true, default: null }) 
    assignedQaId: string | null;

    @Prop({ unique: true, required: true })
    ticketNumber: string;

    @Prop({ required: true, enum: TicketStatus, default: TicketStatus.Open })
    status: TicketStatus;

    @Prop({ required: true })
    ticketTitle: string;

    @Prop({ required: true })
    descriptionLink: string;

    @Prop({ required: true })
    estimationTesting: number;

    @Prop({ required: true })
    developmentEstimation: number;
}

export const TicketSchema = SchemaFactory.createForClass(TicketModel);
TicketSchema.index({ sprintId: 1, assignedDevId: 1 });
TicketSchema.index({ sprintId: 1, assignedQaId: 1 });
