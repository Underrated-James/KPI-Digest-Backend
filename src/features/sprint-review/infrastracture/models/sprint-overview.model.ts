import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SprintStatus } from 'src/features/sprints/domain/enums/sprint-status-enums';
import { UserRole } from 'src/features/users/domain/enums/user-role.enum';
import { TicketStatus } from 'src/features/tickets/domain/enums/ticket-status';
import { SPRINT_OVERVIEW_COLLECTION } from '../../domain/constants/sprint-overview-constants';

@Schema({ _id: false })
export class TeamAllocationSummaryModel {
  @Prop({ required: true })
  totalCapacity: number;

  @Prop({ required: true })
  totalCommitted: number;

  @Prop({ required: true })
  totalAvailable: number;

  @Prop({ required: true })
  totalSpent: number;

  @Prop({ required: true })
  utilization: number;
}

@Schema({ _id: false })
export class DayStatusModel {
  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  status: string;
}

@Schema({ _id: false })
export class MemberMetricModel {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: UserRole })
  role: string;

  @Prop({ required: true })
  rhythm: number;

  @Prop({ required: true })
  sprintCapacity: number;

  @Prop({ required: true })
  committedCapacity: number;

  @Prop({ required: true })
  availableCapacity: number;

  @Prop({ required: true })
  timeSpent: number;

  @Prop({ required: true })
  utilization: number;

  @Prop({ type: [SchemaFactory.createForClass(DayStatusModel)], default: [] })
  leaveTimeline: DayStatusModel[];
}

@Schema({ _id: false })
export class TicketsModel {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  ticketNumber: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, enum: TicketStatus })
  status: string;

  @Prop({ required: true })
  devName: string;

  @Prop({ required: true })
  qaName: string;

  @Prop({ required: true })
  devEstimate: number;

  @Prop({ required: true })
  qaEstimate: number;

  @Prop({ required: true })
  devSpent: number;

  @Prop({ required: true })
  qaSpent: number;
}

@Schema({ _id: false })
export class SprintHolidayModel {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  date: Date;
}

export type SprintOverviewDocument = HydratedDocument<SprintOverviewModel>;

@Schema({ collection: SPRINT_OVERVIEW_COLLECTION, timestamps: true })
export class SprintOverviewModel {
  @Prop({ required: true, index: true })
  projectId: string;

  @Prop({ required: true })
  projectName: string;

  @Prop({ required: true, index: true })
  sprintId: string;

  @Prop({ required: true })
  sprintName: string;

  @Prop({ required: true, enum: SprintStatus, index: true })
  sprintStatus: string;

  @Prop({ required: true })
  planningStatus: string;

  @Prop({ required: true })
  planningStart: Date;

  @Prop({ required: true })
  planningEnd: Date;

  @Prop({ required: true })
  workingDays: number;

  @Prop({ type: Date, default: null })
  actualStart: Date | null;

  @Prop({ type: Date, default: null })
  actualEnd: Date | null;

  @Prop({ required: true })
  teamRhythm: number;

  @Prop({ type: [SchemaFactory.createForClass(SprintHolidayModel)], default: [] })
  holidays: SprintHolidayModel[];

  @Prop({ required: true, index: true })
  teamId: string;

  @Prop({ required: true })
  finalizedAt: Date;

  @Prop({ required: true })
  finalizedBy: string;

  @Prop({ type: SchemaFactory.createForClass(TeamAllocationSummaryModel), required: true })
  summary: TeamAllocationSummaryModel;

  @Prop({ type: [SchemaFactory.createForClass(MemberMetricModel)], default: [] })
  memberMetrics: MemberMetricModel[];

  @Prop({ type: [SchemaFactory.createForClass(TicketsModel)], default: [] })
  sprintTickets: TicketsModel[];

  @Prop({ default: false, index: true })
  isDeleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const SprintOverviewSchema = SchemaFactory.createForClass(SprintOverviewModel);
