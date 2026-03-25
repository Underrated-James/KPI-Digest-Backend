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
    public _dayOff: DayOff[] = [],
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
    let workingDaysCount = 0;
    const curDate = new Date(this._startDate.getTime());
    curDate.setHours(0, 0, 0, 0);
    const end = new Date(this._endDate.getTime());
    end.setHours(0, 0, 0, 0);

    // Get unique valid dayOff dates within the sprint range
    const validDayOffDates = new Set(
      this._dayOff
        .map(d => d.date)
        .filter(dateStr => {
          const d = new Date(dateStr);
          d.setHours(0, 0, 0, 0);
          return d >= curDate && d <= end;
        })
    );

    while (curDate <= end) {
      const dayOfWeek = curDate.getDay();
      const dateStr = curDate.toISOString().split('T')[0];

      // Only count if it's a weekday AND NOT in the valid dayOff list
      if (dayOfWeek !== 0 && dayOfWeek !== 6 && !validDayOffDates.has(dateStr)) {
        workingDaysCount++;
      }
      curDate.setDate(curDate.getDate() + 1);
    }
    return workingDaysCount;
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

  get endDate(): Date {
    return this._endDate;
  }

  get workingHoursDay(): number {
    return this._workingHoursDay;
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

  updateEndDate(endDate: Date): void {
    this._endDate = endDate;
  }

  updateWorkingHoursDate(workingHoursDay: number): void {
    this._workingHoursDay = workingHoursDay;
  }

  updateDayOff(dayOff: DayOff[]): void {
    this._dayOff = dayOff;
  }
}
