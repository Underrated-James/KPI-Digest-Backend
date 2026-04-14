import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ProjectMemberRole } from '../../domain/enums/project-member-role.enum';
import { PROJECT_MEMBER_COLLECTION } from '../../domain/constants/project.constants';

export type ProjectMemberDocument = HydratedDocument<ProjectMemberModel>;

@Schema({ collection: PROJECT_MEMBER_COLLECTION, timestamps: false })
export class ProjectMemberModel {
  @Prop({ required: true, index: true })
  projectId: string;

  @Prop({ required: true, index: true })
  userId: string;

  @Prop({
    required: true,
    enum: ProjectMemberRole,
    default: ProjectMemberRole.MEMBER,
    index: true,
  })
  role: ProjectMemberRole;

  @Prop({ required: true, default: Date.now })
  joinedAt: Date;
}

export const ProjectMemberSchema =
  SchemaFactory.createForClass(ProjectMemberModel);

ProjectMemberSchema.index({ projectId: 1, userId: 1 }, { unique: true });
