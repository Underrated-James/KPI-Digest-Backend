import { TicketDocument } from "../../infrastracture/models/ticket-model";
import { Ticket as TicketsEntity } from "../../domain/entities/ticket.entity";

export function toEntity(doc: TicketDocument): TicketsEntity {
    return new TicketsEntity(
        doc._id.toString(),
        doc.ticketNumber,
        doc.ticketStatus,
        doc.ticketTitle,
        doc.descriptionLink,
        doc.estimationTesting,
        doc.developmentEstimation,
        doc.createdAt,
        doc.updatedAt,
    )
}