import { ProjectDocument } from "../../infrastracture/models/project.model";
import { Project as ProjectsEntity } from "../../domain/entities/project.entity";

export function toEntity(doc: any): ProjectsEntity {
    return new ProjectsEntity(
        doc._id.toString(),
        doc.name,
        doc.status,
        doc.finishDate,
        doc.isDeleted,
        doc.deletedAt,
        doc.sprintCount || 0,
        doc.createdAt,
        doc.updatedAt,
    );
}