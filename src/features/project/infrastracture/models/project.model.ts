import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ProjectStatus } from '../../domain/enums/project-status-enums';
import { PROJECT_COLLECTION } from '../../domain/constants/project.constants';

export type ProjectDocument = HydratedDocument<ProjectModel>;

@Schema({ collection: PROJECT_COLLECTION, timestamps: true })
export class ProjectModel {
  @Prop({
    required: true,
    minlength: 2,
    maxlength: 50,
    index: true,
  })
  name: string;

  @Prop({ required: true, enum: ProjectStatus, index: true })
  status: ProjectStatus;

  @Prop({ required: true })
  finishDate: Date;

  @Prop({ default: false, index: true})
  isDeleted: boolean;
  
  @Prop()
  deletedAt: Date;

  @Prop()
  createdAt: Date;
  
  @Prop()
  updatedAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(ProjectModel);
