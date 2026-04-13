import { ProjectStatus } from "src/features/project/domain/enums/project-status-enums";
import { SprintStatus } from "src/features/sprints/domain/enums/sprint-status-enums";

export class Ticket {
  constructor(
    public readonly id: string,
    public readonly projectId: string,
    public readonly sprintId: string | null,
    public readonly teamId: string | null,
    public readonly assignedDevId: string | null,
    public readonly assignedQaId: string | null,
    public _ticketNumber: string,
    public _status: string,
    public _ticketTitle: string,
    public _descriptionLink: string,
    public _estimationTesting?: number | null,
    public _developmentEstimation?: number | null,
    public _sprintCapacity?: number,
    public _commitedCapacity?: number,
    public _availableCapacity?: number,
    public readonly _projectName?: string,
    public readonly _projectStatus?: ProjectStatus,
    public readonly _sprintName?: string,
    public readonly _sprintStatus?: SprintStatus,
    public readonly _assignedDevName?: string,
    public readonly _assignedDevRole?: string,
    public readonly _assignedQaName?: string,
    public readonly _assignedQaRole?: string,
    public readonly _createdAt?: Date,
    public readonly _updatedAt?: Date,
  ) { }

  get ticketNumber(): string {
    return this._ticketNumber;
  }

  get status(): string {
    return this._status;
  }

  get ticketTitle(): string {
    return this._ticketTitle;
  }

  get descriptionLink(): string {
    return this._descriptionLink;
  }

  get estimationTesting(): number | null {
    return this._estimationTesting || null;
  }

  get developmentEstimation(): number | null {
    return this._developmentEstimation || null;
  }

  get sprintCapacity(): number | undefined {
    return this._sprintCapacity;
  }

  get commitedCapacity(): number | undefined {
    return this._commitedCapacity;
  }

  get availableCapacity(): number | undefined {
    return this._availableCapacity;
  }

  get projectName(): string | undefined {
    return this._projectName;
  }

  get projectStatus(): ProjectStatus | undefined {
    return this._projectStatus;
  }

  get sprintName(): string | undefined {
    return this._sprintName;
  }

  get sprintStatus(): SprintStatus | undefined {
    return this._sprintStatus;
  }

  get assignedDevName(): string | undefined {
    return this._assignedDevName;
  }

  get assignedDevRole(): string | undefined {
    return this._assignedDevRole;
  }

  get assignedQaName(): string | undefined {
    return this._assignedQaName;
  }

  get assignedQaRole(): string | undefined {
    return this._assignedQaRole;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }


  updateTicketTitle(ticketTitle: string): void {
    this._ticketTitle = ticketTitle;
  }
  updateDescriptionLink(descriptionLink: string): void {
    this._descriptionLink = descriptionLink;
  }
  updateStatus(status: string): void {
    this._status = status;
  }

  updateEstimationTesting(estimationTesting: number): void {
    this._estimationTesting = estimationTesting;
  }
  updateDevelopmentEstimation(developmentEstimation: number): void {
    this._developmentEstimation = developmentEstimation;
  }

  updateSprintCapacity(sprintCapacity: number): void {
    this._sprintCapacity = sprintCapacity;
  }

  updateCommitedCapacity(commitedCapacity: number): void {
    this._commitedCapacity = commitedCapacity;
  }

  updateAvailableCapacity(availableCapacity: number): void {
    this._availableCapacity = availableCapacity;
  }


}
