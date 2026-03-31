import { Ticket as TicketsEntity } from "../../domain/entities/ticket.entity";

export function toEntity(doc: any): TicketsEntity {
    return new TicketsEntity(
        doc._id.toString(),
        doc.projectId,
        doc.sprintId,
        doc.teamId,
        doc.assignedUserId,
        doc.ticketNumber,
        doc.status || doc.ticketStatus,
        doc.ticketTitle,
        doc.descriptionLink,
        doc.estimationTesting,
        doc.developmentEstimation,
        doc.projectName,
        doc.projectStatus,
        doc.sprintName,
        doc.sprintStatus,
        doc.assignedUserName,
        doc.assignedUserRole,
        doc.createdAt,
        doc.updatedAt,
    )
}