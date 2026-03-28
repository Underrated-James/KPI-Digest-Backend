import { SprintDocument } from "../../domain/schema/sprint-schema";
import { Sprint as SprintEntity } from "../../domain/entities/sprint-entity";
export function toEntity(doc: SprintDocument): SprintEntity {
    return new SprintEntity(
        doc._id.toString(),
        doc.projectId,
        doc.name,
        doc.status,
        doc.startDate,
        doc.endDate,
        doc.workingHoursDay,
        doc.sprintDuration,
        doc.dayOff || [],
        doc.officialStartDate ?? null,
        doc.officialEndDate ?? null,
        doc.createdAt,
        doc.updatedAt
    );
}