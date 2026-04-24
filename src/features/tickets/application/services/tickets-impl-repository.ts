import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TicketRepository } from '../../infrastracture/repositories/tickets-repository';
import { TICKET_MODEL } from '../../domain/constants/ticket.constants';
import { TicketDocument } from '../../infrastracture/models/ticket-model';
import { TicketStatus } from '../../domain/enums/ticket-status';
import { Ticket as TicketEntity } from '../../domain/entities/ticket.entity';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { toEntity } from '../../infrastracture/mappers/ticket-mapper';
import { PROJECT_COLLECTION } from 'src/features/project/domain/constants/project.constants';
import { SPRINT_COLLECTION } from 'src/features/sprints/domain/constants/sprint.constants';
import { USER_COLLECTION } from 'src/features/users/domain/constants/user.constants';

@Injectable()
export class TicketMongooseRepository implements TicketRepository {
    constructor(
        @InjectModel(TICKET_MODEL)
        private readonly ticketModel: Model<TicketDocument>,
    ) { }

    private getAggregationPipeline(query: any): any[] {
        return [
            { $match: query },
            {
                $addFields: {
                    projectObjId: { $toObjectId: '$projectId' },
                    sprintObjId: { $cond: [{ $and: [{ $ne: ['$sprintId', null] }, { $ne: ['$sprintId', ''] }] }, { $toObjectId: '$sprintId' }, null] },
                    devObjId: { $cond: [{ $ne: ['$assignedDevId', null] }, { $toObjectId: '$assignedDevId' }, null] },
                    qaObjId: { $cond: [{ $ne: ['$assignedQaId', null] }, { $toObjectId: '$assignedQaId' }, null] }
                }
            },
            {
                $lookup: {
                    from: PROJECT_COLLECTION,
                    localField: 'projectObjId',
                    foreignField: '_id',
                    as: 'project'
                }
            },
            { $unwind: { path: '$project', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: SPRINT_COLLECTION,
                    localField: 'sprintObjId',
                    foreignField: '_id',
                    as: 'sprint'
                }
            },
            { $unwind: { path: '$sprint', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: USER_COLLECTION,
                    localField: 'devObjId',
                    foreignField: '_id',
                    as: 'assignedDev'
                }
            },
            { $unwind: { path: '$assignedDev', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: USER_COLLECTION,
                    localField: 'qaObjId',
                    foreignField: '_id',
                    as: 'assignedQa'
                }
            },
            { $unwind: { path: '$assignedQa', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    projectId: 1,
                    sprintId: 1,
                    teamId: 1,
                    assignedDevId: 1,
                    assignedQaId: 1,
                    ticketNumber: 1,
                    status: 1,
                    ticketTitle: 1,
                    description: 1,
                    descriptionLink: 1,
                    estimationTesting: 1,
                    developmentEstimation: 1,
                    sprintCapacity: 1,
                    commitedCapacity: 1,
                    availableCapacity: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    projectName: '$project.name',
                    projectStatus: '$project.status',
                    sprintName: '$sprint.name',
                    sprintStatus: '$sprint.status',
                    assignedDevName: '$assignedDev.name',
                    assignedDevRole: '$assignedDev.role',
                    assignedQaName: '$assignedQa.name',
                    assignedQaRole: '$assignedQa.role'
                }
            }
        ];
    }

    //Find Ticket by Ticket Number
    async findTicketNumber(ticketNumber: string): Promise<TicketEntity | null> {
        const query = { ticketNumber };
        const docs = await this.ticketModel.aggregate(this.getAggregationPipeline(query)).exec();
        return docs.length > 0 ? toEntity(docs[0]) : null;
    }

    //Get All Tickets with Pagination (page is 1-indexed)
    async findAllPaginated(
        page: number, 
        size: number, 
        status?: TicketStatus, 
        projectId?: string, 
        sprintId?: string, 
        teamId?: string,
        search?: string
    ): Promise<PaginatedResult<TicketEntity>> {
        const query: any = {};
        if (status) query.status = status;
        if (projectId) query.projectId = projectId;
        if (sprintId) query.sprintId = sprintId;
        if (teamId) query.teamId = teamId;

        if (search) {
            const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(safeSearch, 'i');
            query.$or = [
                { ticketNumber: regex },
                { ticketTitle: regex }
            ];
        }

        const skip = (page - 1) * size;

        const totalElements = await this.ticketModel.countDocuments(query).exec();
        const pipeline = [
            ...this.getAggregationPipeline(query),
            { $skip: skip },
            { $limit: size }
        ];

        const docs = await this.ticketModel.aggregate(pipeline).exec();
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
            projectId: ticket.projectId,
            sprintId: ticket.sprintId,
            teamId: ticket.teamId,
            assignedDevId: ticket.assignedDevId,
            assignedQaId: ticket.assignedQaId,
            ticketNumber: ticket.ticketNumber,
            ticketTitle: ticket.ticketTitle,
            description: ticket.description,
            descriptionLink: ticket.descriptionLink,
            estimationTesting: ticket.estimationTesting,
            developmentEstimation: ticket.developmentEstimation,
            sprintCapacity: (ticket as any).sprintCapacity || 0,
            commitedCapacity: (ticket as any).commitedCapacity || 0,
            availableCapacity: (ticket as any).availableCapacity || 0,
            status: ticket.status
        });
        const doc = await createdTicket.save();
        return this.findById(doc._id.toString()) as Promise<TicketEntity>;
    }

    async createMany(tickets: TicketEntity[]): Promise<TicketEntity[]> {
        const ticketModels = tickets.map(ticket => ({
            projectId: ticket.projectId,
            sprintId: ticket.sprintId,
            teamId: ticket.teamId,
            assignedDevId: ticket.assignedDevId,
            assignedQaId: ticket.assignedQaId,
            ticketNumber: ticket.ticketNumber,
            ticketTitle: ticket.ticketTitle,
            description: ticket.description,
            descriptionLink: ticket.descriptionLink,
            estimationTesting: ticket.estimationTesting,
            developmentEstimation: ticket.developmentEstimation,
            sprintCapacity: (ticket as any).sprintCapacity || 0,
            commitedCapacity: (ticket as any).commitedCapacity || 0,
            availableCapacity: (ticket as any).availableCapacity || 0,
            status: ticket.status
        }));

        const docs = await this.ticketModel.insertMany(ticketModels);
        const ids = docs.map(doc => doc._id);
        
        const query = { _id: { $in: ids } };
        const enrichedDocs = await this.ticketModel.aggregate(this.getAggregationPipeline(query)).exec();
        return enrichedDocs.map(doc => toEntity(doc));
    }

    //Get All Tickets (filter with status optional)
    async findAll(status?: TicketStatus, projectId?: string, sprintId?: string, teamId?: string): Promise<TicketEntity[]> {
        const query: any = {};
        if (status) query.status = status;
        if (projectId) query.projectId = projectId;
        if (sprintId) query.sprintId = sprintId;
        if (teamId) query.teamId = teamId;
        const docs = await this.ticketModel.aggregate(this.getAggregationPipeline(query)).exec();
        return docs.map((doc) => toEntity(doc));
    }

    async findAvailableForSprint(
        projectId: string,
        sprintId?: string | null,
        statuses?: TicketStatus[],
    ): Promise<TicketEntity[]> {
        const query: any = { projectId };

        if (sprintId !== undefined) {
            query.sprintId = sprintId;
        }

        if (statuses && statuses.length > 0) {
            query.status = { $in: statuses };
        }

        const docs = await this.ticketModel.aggregate(this.getAggregationPipeline(query)).exec();
        return docs.map((doc) => toEntity(doc));
    }

    //Get Ticket by ID
    async findById(id: string): Promise<TicketEntity | null> {
        if (!Types.ObjectId.isValid(id)) return null;
        const query = { _id: new Types.ObjectId(id) };
        const docs = await this.ticketModel.aggregate(this.getAggregationPipeline(query)).exec();
        return docs.length > 0 ? toEntity(docs[0]) : null;
    }

    // Patch Ticket by ID
    async patch(
        id: string,
        ticket: Partial<TicketEntity>,
    ): Promise<TicketEntity | null> {
        const updateData = this.getPatchUpdateData(ticket);

        await this.ticketModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
        return this.findById(id);
    }

    // Patch Many Tickets
    async patchMany(
        updates: { id: string; data: Partial<TicketEntity> }[],
    ): Promise<TicketEntity[]> {
        const bulkOps = updates.map(update => ({
            updateOne: {
                filter: { _id: new Types.ObjectId(update.id) },
                update: { $set: this.getPatchUpdateData(update.data) },
            },
        }));

        await this.ticketModel.bulkWrite(bulkOps);

        const ids = updates.map(u => new Types.ObjectId(u.id));
        const query = { _id: { $in: ids } };
        const enrichedDocs = await this.ticketModel.aggregate(this.getAggregationPipeline(query)).exec();
        return enrichedDocs.map(doc => toEntity(doc));
    }

    private getPatchUpdateData(ticket: Partial<TicketEntity>): any {
        const updateData: any = {};
        if (ticket.ticketNumber) updateData.ticketNumber = ticket.ticketNumber;
        if (ticket.ticketTitle) updateData.ticketTitle = ticket.ticketTitle;
        if (ticket.description !== undefined) updateData.description = ticket.description;
        if (ticket.descriptionLink) updateData.descriptionLink = ticket.descriptionLink;
        if (ticket.estimationTesting !== undefined) updateData.estimationTesting = ticket.estimationTesting;
        if (ticket.developmentEstimation !== undefined) updateData.developmentEstimation = ticket.developmentEstimation;
        if ((ticket as any).sprintCapacity !== undefined) updateData.sprintCapacity = (ticket as any).sprintCapacity;
        if ((ticket as any).commitedCapacity !== undefined) updateData.commitedCapacity = (ticket as any).commitedCapacity;
        if ((ticket as any).availableCapacity !== undefined) updateData.availableCapacity = (ticket as any).availableCapacity;
        if (ticket.status) updateData.status = ticket.status;
        if (ticket.assignedDevId !== undefined) updateData.assignedDevId = ticket.assignedDevId;
        if (ticket.assignedQaId !== undefined) updateData.assignedQaId = ticket.assignedQaId;
        if (ticket.teamId !== undefined) updateData.teamId = ticket.teamId;
        if (ticket.projectId !== undefined) updateData.projectId = ticket.projectId;
        if (ticket.sprintId !== undefined) updateData.sprintId = ticket.sprintId;
        return updateData;
    }

    //PUT Ticket by ID
    async put(id: string, ticket: TicketEntity): Promise<TicketEntity | null> {
        const updateData = {
            projectId: ticket.projectId,
            sprintId: ticket.sprintId,
            teamId: ticket.teamId,
            assignedDevId: ticket.assignedDevId,
            assignedQaId: ticket.assignedQaId,
            ticketNumber: ticket.ticketNumber,
            ticketTitle: ticket.ticketTitle,
            description: ticket.description,
            descriptionLink: ticket.descriptionLink,
            estimationTesting: ticket.estimationTesting,
            developmentEstimation: ticket.developmentEstimation,
            sprintCapacity: (ticket as any).sprintCapacity || 0,
            commitedCapacity: (ticket as any).commitedCapacity || 0,
            availableCapacity: (ticket as any).availableCapacity || 0,
            status: ticket.status,
        };

        await this.ticketModel.findByIdAndUpdate(id, updateData, {
            new: true,
            overwrite: true,
            runValidators: true,
        }).exec();

        return this.findById(id);
    }

    //Delete Ticket by ID
    async delete(id: string): Promise<void> {
        await this.ticketModel.findByIdAndDelete(id).exec();
    }
}
