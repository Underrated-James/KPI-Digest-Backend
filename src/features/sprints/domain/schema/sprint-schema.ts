import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SprintStatus } from '../enums/sprint-status-enums';
import { DayOffSchema } from './dayOff-schema';
export type SprintDocument = HydratedDocument<Sprint>;

// Define the nested schema for DayOff
@Schema({ collection: 'Sprints', timestamps: true })
export class Sprint {
  @Prop({ required: true })
  projectId: string;

  @Prop({
    required: true,
    minlength: 2,
    maxlength: 50,
  })
  name: string;

  @Prop({ required: true, enum: SprintStatus })
  status: SprintStatus;

  @Prop({ required: false })
  sprintDuration: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  workingHoursDay: number;

  @Prop({ type: Date, default: null })
  officialStartDate: Date | null;

  @Prop({ type: Date, default: null })
  officialEndDate: Date | null;

  @Prop({ type: [DayOffSchema], default: [] })
  dayOff: { label: string; date: string }[];

  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
}

export const SprintSchema = SchemaFactory.createForClass(Sprint);
