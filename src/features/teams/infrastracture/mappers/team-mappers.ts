import { Team as TeamEntity } from "../../domain/entities/team.entity";

export function toEntity(doc: any): TeamEntity {
    return new TeamEntity(
        doc._id.toString(),
        doc.projectId,
        doc.sprintId,
        doc.calculatedHoursPerDay,
        doc.userIds,
        doc.projectName,
        doc.projectStatus,
        doc.sprintName,
        doc.sprintStatus,
        doc.HoursDay,
        doc.createdAt,
        doc.updatedAt,
    );
}