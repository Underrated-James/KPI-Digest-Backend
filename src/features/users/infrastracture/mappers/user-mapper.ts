import { UserDocument } from "../../infrastracture/models/user.model";
import { User as UserEntity } from "../../domain/entities/user.entity";

export function toEntity(doc: UserDocument): UserEntity {
    return new UserEntity(
        doc._id.toString(),
        doc.name,
        doc.email,
        doc.role,
        doc.createdAt,
        doc.updatedAt,
    );
}