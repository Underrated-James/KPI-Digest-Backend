import { Project as ProjectsEntity } from "../../domain/entities/project.entity";
import { toEntity as toUserEntity } from "src/features/users/infrastracture/mappers/user-mapper";

export function toEntity(doc: any): ProjectsEntity {
    return new ProjectsEntity(
        doc._id.toString(),
        doc.name,
        doc.status,
        doc.projectCode,
        doc.ticketSequence || 0,
        doc.finishDate,
        doc.isDeleted,
        doc.deletedAt,
        doc.sprintCount || 0,
        Array.isArray(doc.members) ? doc.members.map((member: any) => toUserEntity(member)) : [],
        doc.ownerIds || [],
        doc.createdBy,
        doc.createdAt,
        doc.updatedAt,
    );
}
