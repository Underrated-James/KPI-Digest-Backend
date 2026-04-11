import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TEAM_COLLECTION } from '../../domain/constants/team.constants';

export type TeamDocument = HydratedDocument<TeamModel>;

@Schema({ collection: TEAM_COLLECTION, timestamps: true })
export class TeamModel {

  @Prop({ required: true })
  projectId: string;

  @Prop({ required: true })
  sprintId: string;

  @Prop({ required: true, type: Array })
  userIds: {
    userId: string;
    allocationPercentage: number;
    hoursPerDay: number;
    role: string;
    leave?: any[];
  }[];

  @Prop()
  createdAt: Date;
  
  @Prop()
  updatedAt: Date;
}

export const TeamSchema = SchemaFactory.createForClass(TeamModel);
