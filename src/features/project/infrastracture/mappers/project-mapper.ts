import { ProjectDocument } from "../../infrastracture/models/project.model";
import { Project as ProjectsEntity } from "../../domain/entities/project.entity";

export function toEntity(doc: ProjectDocument): ProjectsEntity {
    return new ProjectsEntity(
        doc._id.toString(),
        doc.name,
        doc.status,
        doc.finishDate,
        doc.isDeleted,
        doc.deletedAt,
        doc.createdAt,
        doc.updatedAt,
    );
}