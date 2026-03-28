import { TeamDocument } from "../../infrastracture/models/team.model";
import { Team as TeamEntity } from "../../domain/entities/team.entity";

export function toEntity(doc: TeamDocument): TeamEntity {
    return new TeamEntity(
        doc._id.toString(),
        doc.projectId,
        doc.projectName,
        doc.projectStatus,
        doc.sprintId,
        doc.sprintName,
        doc.sprintStatus,
        doc.HoursDay,
        doc.userIds,
        doc.allocationPercentage,
        doc.calculatedHoursPerDay,
        doc.createdAt,
        doc.updatedAt,
    );
}