import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ProjectStatus } from '../enums/project-status-enums';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ collection: 'Projects', timestamps: true })
export class Project {

  @Prop({
     required: true,
    minlength: 2,
    maxlength: 50,
  })
  name: string;

  @Prop({ required: true, enum: ProjectStatus })
  status: ProjectStatus;

  @Prop({ required: true })
  finishDate: Date;

  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
