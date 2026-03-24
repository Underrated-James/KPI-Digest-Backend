export class Project {
  constructor(
    public readonly id: string,
    public _name: string,
    public _status: boolean,
    public _finishDate: Date,
    public readonly _createdAt?: Date,
    public readonly _updatedAt?: Date,
  ) {}

  get name(): string {
    return this._name;
  }

  get status(): boolean {
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
  updatestatus(status: boolean): void {
    this._status = status;
  }

  updatefinishDate(finishDate: Date): void {
    this._finishDate = finishDate;
  }
}
