import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TicketRepository } from '../../infrastracture/repositories/tickets-repository';
import { TICKET_MODEL } from '../../domain/constants/ticket.constants';
import { TicketDocument } from '../../infrastracture/models/ticket-model';
import { TicketStatus } from '../../domain/enums/ticket-status';
import { Ticket as TicketEntity } from '../../domain/entities/ticket.entity';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { toEntity } from '../../infrastracture/mappers/ticket-mapper';
@Injectable()
export class TicketMongooseRepository implements TicketRepository {
    constructor(
        @InjectModel(TICKET_MODEL)
        private readonly ticketModel: Model<TicketDocument>,
    ) { }
    //Find Ticket by Ticket Number
    async findTicketNumber(ticketNumber: string): Promise<TicketEntity | null> {
        const doc = await this.ticketModel.findOne({ ticketNumber }).exec();
        return doc ? toEntity(doc) : null;
    }

    //Get All Tickets with Pagination (page is 1-indexed)
    async findAllPaginated(page: number, size: number, status?: TicketStatus): Promise<PaginatedResult<TicketEntity>> {
        const query = status ? { status } : {};
        const skip = (page - 1) * size; // Zero-Index Trap: page 1 → skip 0

        // Run count + paginated fetch in parallel for performance
        const [totalElements, docs] = await Promise.all([
            this.ticketModel.countDocuments(query).exec(),
            this.ticketModel.find(query).skip(skip).limit(size).exec(),
        ]);

        const content = docs.map((doc) => toEntity(doc));
        const totalPages = Math.ceil(totalElements / size);

        return {
            content,
            page,
            size,
            totalElements,
            totalPages,
            numberOfElements: content.length,
            firstPage: page === 1,
            lastPage: page >= totalPages,
        };
    }
    // Create Ticket
    async create(ticket: TicketEntity): Promise<TicketEntity> {
        const createdTicket = new this.ticketModel({
            ticketNumber: ticket.ticketNumber,
            ticketTitle: ticket.ticketTitle,
            descriptionLink: ticket.descriptionLink,
            estimationTesting: ticket.estimationTesting,
            developmentEstimation: ticket.developmentEstimation,
            status: ticket.status
        });
        const doc = await createdTicket.save();
        return toEntity(doc);
    }

    //Get All Tickets (filter with status optional)
    async findAll(status?: TicketStatus): Promise<TicketEntity[]> {
        const query = status ? { status } : {};
        const docs = await this.ticketModel.find(query).exec();
        return docs.map((doc) => toEntity(doc));
    }
    //Get Ticket by ID
    async findById(id: string): Promise<TicketEntity | null> {
        const doc = await this.ticketModel.findById(id).exec();
        return doc ? toEntity(doc) : null;
    }

    // Patch Ticket by ID
    async patch(
        id: string,
        ticket: Partial<TicketEntity>,
    ): Promise<TicketEntity | null> {
        const updateData: any = {};
        if (ticket.ticketNumber) updateData.ticketNumber = ticket.ticketNumber;
        if (ticket.ticketTitle) updateData.ticketTitle = ticket.ticketTitle;
        if (ticket.descriptionLink) updateData.descriptionLink = ticket.descriptionLink;
        if (ticket.estimationTesting !== undefined) updateData.estimationTesting = ticket.estimationTesting;
        if (ticket.developmentEstimation !== undefined) updateData.developmentEstimation = ticket.developmentEstimation;
        if (ticket.status) updateData.status = ticket.status;

        const doc = await this.ticketModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .exec();
        return doc ? toEntity(doc) : null;
    }

    //PUT Ticket by ID
    async put(id: string, ticket: TicketEntity): Promise<TicketEntity | null> {
        const updateData = {
            ticketNumber: ticket.ticketNumber,
            ticketTitle: ticket.ticketTitle,
            descriptionLink: ticket.descriptionLink,
            estimationTesting: ticket.estimationTesting,
            developmentEstimation: ticket.developmentEstimation,
            status: ticket.status,
        };

        const doc = await this.ticketModel
            .findByIdAndUpdate(id, updateData, {
                new: true,
                overwrite: true,
                runValidators: true,
            })
            .exec();

        return doc ? toEntity(doc) : null;
    }

    //Delete Ticket by ID
    async delete(id: string): Promise<void> {
        await this.ticketModel.findByIdAndDelete(id).exec();
    }
}
