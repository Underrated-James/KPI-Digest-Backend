import { SprintStatus } from "../enums/sprint-status-enums";

export interface DayOff {
  label: string;
  date: string; // ISO format YYYY-MM-DD
}

export class Sprint {
  constructor(
    public readonly id: string,
    public _projectId: string,
    public _name: string,
    public _status: SprintStatus,
    public _startDate: Date,
    public _endDate: Date,
    public _workingHoursDay: number,
    public _sprintDuration: number,
    public _dayOff: DayOff[] = [],
    public _officialStartDate: Date | null = null,
    public _officialEndDate: Date | null = null,
    public _projectName?: string,
    public _isDeleted: boolean = false,
    public _deletedAt?: Date,
    public readonly _createdAt?: Date,
    public readonly _updatedAt?: Date,
  ) {}

  get projectId(): string {
    return this._projectId;
  }

  get name(): string {
    return this._name;
  }

  get sprintDuration(): number {
    return this._sprintDuration;
  }

  get dayOff(): DayOff[] {
    return this._dayOff;
  }

  get status(): SprintStatus {
    return this._status;
  }

  get startDate(): Date {
    return this._startDate;
  }

  get officialStartDate(): Date | null {
    return this._officialStartDate;
  }

  get endDate(): Date {
    return this._endDate;
  }

  get officialEndDate(): Date | null {
    return this._officialEndDate;
  }

  get projectName(): string | undefined {
    return this._projectName;
  }

  get workingHoursDay(): number {
    return this._workingHoursDay;
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

  updateProjectId(projectId: string): void {
    this._projectId = projectId;
  }

  updateName(name: string): void {
    this._name = name;
  }

  updateStartDate(startDate: Date): void {
    this._startDate = startDate;
  }

  updateOfficialStartDate(officialStartDate: Date | null): void {
    this._officialStartDate = officialStartDate;
  }

  updateEndDate(endDate: Date): void {
    this._endDate = endDate;
  }

  updateOfficialEndDate(officialEndDate: Date | null): void {
    this._officialEndDate = officialEndDate;
  }

  updateWorkingHoursDate(workingHoursDay: number): void {
    this._workingHoursDay = workingHoursDay;
  }

  updateSprintDuration(sprintDuration: number): void {
    this._sprintDuration = sprintDuration;
  }

  updateDayOff(dayOff: DayOff[]): void {
    this._dayOff = dayOff;
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
