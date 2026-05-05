import { SprintStatus } from 'src/features/sprints/domain/enums/sprint-status-enums';
import { UserRole } from 'src/features/users/domain/enums/user-role.enum';
import { TicketStatus } from 'src/features/tickets/domain/enums/ticket-status';

export interface TeamAllocationSummary {
  totalCapacity: number;
  totalCommitted: number;
  totalAvailable: number;
  totalSpent: number;
  utilization: number;
}

export interface SprintHoliday {
  name: string;
  date: Date;
}

export interface DayStatus {
  date: Date;
  status: string; // "OFF", "V", "W", "S", "O", "H", etc.
}

export interface MemberMetric {
  userId: string;
  name: string;
  role: UserRole | string;
  rhythm: number;
  sprintCapacity: number;
  committedCapacity: number;
  availableCapacity: number;
  timeSpent: number;
  utilization: number;
  leaveTimeline: DayStatus[];
}

export interface Tickets {
  id: string;
  ticketNumber: string;
  title: string;
  status: TicketStatus | string;
  devName: string;
  qaName: string;
  devEstimate: number;
  qaEstimate: number;
  devSpent: number;
  qaSpent: number;
}

export class SprintOverviewEntity {
  constructor(
    public readonly id: string,
    public _projectId: string,
    public _projectName: string,
    public _sprintId: string,
    public _sprintName: string,
    public _sprintStatus: SprintStatus | string,
    public _planningStatus: string,
    public _planningStart: Date,
    public _planningEnd: Date,
    public _workingDays: number,
    public _actualStart: Date | null,
    public _actualEnd: Date | null,
    public _teamRhythm: number,
    public _holidays: SprintHoliday[] = [],
    public _teamId: string,
    public _finalizedAt: Date,
    public _finalizedBy: string,
    public _summary: TeamAllocationSummary,
    public _memberMetrics: MemberMetric[] = [],
    public _sprintTickets: Tickets[] = [],
    public _isDeleted: boolean = false,
    public _deletedAt?: Date,
    public readonly _createdAt?: Date,
    public readonly _updatedAt?: Date,
  ) {}

  get projectId(): string {
    return this._projectId;
  }

  get projectName(): string {
    return this._projectName;
  }

  get sprintId(): string {
    return this._sprintId;
  }

  get sprintName(): string {
    return this._sprintName;
  }

  get sprintStatus(): SprintStatus | string {
    return this._sprintStatus;
  }

  get planningStatus(): string {
    return this._planningStatus;
  }

  get planningStart(): Date {
    return this._planningStart;
  }

  get planningEnd(): Date {
    return this._planningEnd;
  }

  get workingDays(): number {
    return this._workingDays;
  }

  get actualStart(): Date | null {
    return this._actualStart;
  }

  get actualEnd(): Date | null {
    return this._actualEnd;
  }

  get teamRhythm(): number {
    return this._teamRhythm;
  }

  get holidays(): SprintHoliday[] {
    return this._holidays;
  }

  get teamId(): string {
    return this._teamId;
  }

  get finalizedAt(): Date {
    return this._finalizedAt;
  }

  get finalizedBy(): string {
    return this._finalizedBy;
  }

  get summary(): TeamAllocationSummary {
    return this._summary;
  }

  get memberMetrics(): MemberMetric[] {
    return this._memberMetrics;
  }

  get sprintTickets(): Tickets[] {
    return this._sprintTickets;
  }

  get isDeleted(): boolean {
    return this._isDeleted;
  }

  get deletedAt(): Date | undefined {
    return this._deletedAt;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  updateProjectName(projectName: string): void {
    this._projectName = projectName;
  }

  updateSprintName(sprintName: string): void {
    this._sprintName = sprintName;
  }

  updateSprintStatus(sprintStatus: SprintStatus | string): void {
    this._sprintStatus = sprintStatus;
  }

  updatePlanningStatus(planningStatus: string): void {
    this._planningStatus = planningStatus;
  }

  updatePlanningWindow(start: Date, end: Date): void {
    this._planningStart = start;
    this._planningEnd = end;
  }

  updateWorkingDays(workingDays: number): void {
    this._workingDays = workingDays;
  }

  updateActualDates(start: Date | null, end: Date | null): void {
    this._actualStart = start;
    this._actualEnd = end;
  }

  updateTeamRhythm(teamRhythm: number): void {
    this._teamRhythm = teamRhythm;
  }

  updateHolidays(holidays: SprintHoliday[]): void {
    this._holidays = holidays;
  }

  updateFinalizedAt(finalizedAt: Date): void {
    this._finalizedAt = finalizedAt;
  }

  updateFinalizedBy(finalizedBy: string): void {
    this._finalizedBy = finalizedBy;
  }

  updateSummary(summary: TeamAllocationSummary): void {
    this._summary = summary;
  }

  updateMemberMetrics(memberMetrics: MemberMetric[]): void {
    this._memberMetrics = memberMetrics;
  }

  updateSprintTickets(sprintTickets: Tickets[]): void {
    this._sprintTickets = sprintTickets;
  }

  updateIsDeleted(isDeleted: boolean): void {
    this._isDeleted = isDeleted;
  }

  updateDeletedAt(deletedAt: Date | undefined): void {
    this._deletedAt = deletedAt;
  }

  softDelete(): void {
    this._isDeleted = true;
    this._deletedAt = new Date();
  }

  restore(): void {
    this._isDeleted = false;
    this._deletedAt = undefined;
  }
}
