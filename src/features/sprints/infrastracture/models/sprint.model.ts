import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SprintStatus } from '../../domain/enums/sprint-status-enums';
import { SPRINT_COLLECTION } from '../../domain/constants/sprint.constants';

@Schema({ _id: false }) 
export class DayOffModel {
  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  date: string;
}

export const DayOffSchema = SchemaFactory.createForClass(DayOffModel);

export type SprintDocument = HydratedDocument<SprintModel>;

@Schema({ collection: SPRINT_COLLECTION, timestamps: true })
export class SprintModel {
  @Prop({ required: true, index: true })
  projectId: string;

  @Prop({
    required: true,
    minlength: 2,
    maxlength: 50,
    index: true,
  })
  name: string;

  @Prop({ required: true, enum: SprintStatus, index: true })
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

  @Prop({ default: false, index: true })
  isDeleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  @Prop()
  createdAt: Date;
  
  @Prop()
  updatedAt: Date;
}

export const SprintSchema = SchemaFactory.createForClass(SprintModel);
