import { Team as TeamEntity } from "../../domain/entities/team.entity";

export function toEntity(doc: any): TeamEntity {
    return new TeamEntity(
        doc._id.toString(),
        doc.projectId,
        doc.sprintId,
        doc.userIds.map((u: any) => ({
            userId: u.userId,
            name: u.name,
            allocationPercentage: u.allocationPercentage,
            hoursPerDay: u.hoursPerDay,
            role: u.role,
            leave: u.leave
        })),
        doc.projectName,
        doc.projectStatus,
        doc.sprintName,
        doc.sprintStatus,
        doc.HoursDay,
        doc.createdAt,
        doc.updatedAt,
    );
}