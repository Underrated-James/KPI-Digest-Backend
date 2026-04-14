import { ProjectStatus } from '../enums/project-status-enums';
import { User } from 'src/features/users/domain/entities/user.entity';

export class Project {
  constructor(
    public readonly id: string,
    public _name: string,
    public _status: ProjectStatus,
    public _finishDate: Date,
    public _isDeleted: boolean = false,
    public _deletedAt?: Date,
    public _sprintCount: number = 0,
    public _members: User[] = [],
    public _ownerIds: string[] = [],
    public _createdBy?: string,
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

  get sprintCount(): number {
    return this._sprintCount;
  }

  get members(): User[] {
    return this._members;
  }

  get ownerIds(): string[] {
    return this._ownerIds;
  }

  get createdBy(): string | undefined {
    return this._createdBy;
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

  updateName(name: string): void {
    this._name = name;
  }
  updateStatus(status: ProjectStatus): void {
    this._status = status;
  }

  updateFinishDate(finishDate: Date): void {
    this._finishDate = finishDate;
  }

  updateMembers(members: User[]): void {
    this._members = members;
  }

  updateOwnerIds(ownerIds: string[]): void {
    this._ownerIds = ownerIds;
  }

  updateCreatedBy(createdBy?: string): void {
    this._createdBy = createdBy;
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
