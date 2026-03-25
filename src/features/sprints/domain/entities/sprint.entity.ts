import { SprintStatus } from "../enums/sprint-status-enums";

export class Sprint {
  constructor(
    public readonly id: string,
    public _name: string,
    public _status: SprintStatus,
    public _startDate: Date,
    public _endDate: Date,
    public _workingHoursDay: number,
    public readonly _createdAt?: Date,
    public readonly _updatedAt?: Date,
  ) {}

  get name(): string {
    return this._name;
  }

  get sprintDuration(): number {
    let count = 0;
    const curDate = new Date(this._startDate.getTime());
    curDate.setHours(0, 0, 0, 0);
    const end = new Date(this._endDate.getTime());
    end.setHours(0, 0, 0, 0);
    
    while (curDate <= end) {
      const dayOfWeek = curDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
      curDate.setDate(curDate.getDate() + 1);
    }
    return count;
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
}
