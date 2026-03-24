import { ProjectStatus } from '../enums/project-status-enums';

export class Project {
  constructor(
    public readonly id: string,
    public _name: string,
    public _status: ProjectStatus,
    public _finishDate: Date,
    public readonly _createdAt?: Date,
    public readonly _updatedAt?: Date,
  ) {}

  get name(): string {
    return this._name;
  }

  get status(): ProjectStatus {
    return this._status;
  }

  get finishDate(): Date {
    return this._finishDate;
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
  updateStatus(status: ProjectStatus): void {
    this._status = status;
  }

  updateFinishDate(finishDate: Date): void {
    this._finishDate = finishDate;
  }
}
