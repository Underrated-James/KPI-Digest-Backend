import { SprintDocument } from "../../infrastracture/models/sprint.model";
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
        doc.isDeleted ?? false,
        doc.deletedAt ?? undefined,
        doc.createdAt ?? undefined,
        doc.updatedAt ?? undefined
    );
}