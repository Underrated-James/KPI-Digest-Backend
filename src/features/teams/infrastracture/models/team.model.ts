import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ListOfUsers } from '../../application/api/dto/request/create-team.dto';
import { ProjectStatus } from 'src/features/project/domain/enums/project-status-enums';
import { SprintStatus } from 'src/features/sprints/domain/enums/sprint-status-enums';
import { TEAM_COLLECTION } from '../../domain/constants/team.constants';

export type TeamDocument = HydratedDocument<TeamModel>;

@Schema({ collection: TEAM_COLLECTION, timestamps: true })
export class TeamModel {

  @Prop({ required: true })
  projectId: string;

  @Prop({ required: true })
  projectName: string;

  @Prop({ required: true, enum: ProjectStatus })
  projectStatus: ProjectStatus;

  @Prop({ required: true })
  sprintId: string;

  @Prop({ required: true })
  sprintName: string;

  @Prop({ required: true, enum: SprintStatus })
  sprintStatus: SprintStatus;

  @Prop({ required: true })
  HoursDay: number;

  @Prop({ required: true })
  allocationPercentage: number;

  @Prop({ required: true })
  calculatedHoursPerDay: number;

  @Prop({ required: true })
  userIds: ListOfUsers[];

  @Prop()
  createdAt: Date;
  
  @Prop()
  updatedAt: Date;
}

export const TeamSchema = SchemaFactory.createForClass(TeamModel);
