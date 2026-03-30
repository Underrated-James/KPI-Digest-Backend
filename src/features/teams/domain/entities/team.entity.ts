import { ProjectStatus } from "src/features/project/domain/enums/project-status-enums";
import { SprintStatus } from "src/features/sprints/domain/enums/sprint-status-enums";
import { ListOfUsers } from "../../application/api/dto/request/create-team.dto";

export class Team {
  constructor(
    public readonly id: string,
    public _projectId: string,
    public _sprintId: string,
    public _calculatedHoursPerDay: number,
    public _userIds: ListOfUsers[],
    public _projectName?: string,
    public _projectStatus?: ProjectStatus,
    public _sprintName?: string,
    public _sprintStatus?: SprintStatus,
    public _HoursDay?: number,
    public readonly _createdAt?: Date,
    public readonly _updatedAt?: Date,
  ) { }

  get projectId(): string {
    return this._projectId;
  }

  get projectName(): string | undefined {
    return this._projectName;
  }

  get projectStatus(): ProjectStatus | undefined {
    return this._projectStatus;
  }

  get sprintId(): string {
    return this._sprintId;
  }

  get sprintName(): string | undefined {
    return this._sprintName;
  }

  get sprintStatus(): SprintStatus | undefined {
    return this._sprintStatus;
  }

  get HoursDay(): number | undefined {
    return this._HoursDay;
  }

  get userIds(): ListOfUsers[] {
    return this._userIds;
  }

  get calculatedHoursPerDay(): number {
    return this._calculatedHoursPerDay;
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

  updateProjectName(projectName: string): void {
    this._projectName = projectName;
  }

  updateProjectStatus(projectStatus: ProjectStatus): void {
    this._projectStatus = projectStatus;
  }

  updateSprintId(sprintId: string): void {
    this._sprintId = sprintId;
  }

  updateSprintName(sprintName: string): void {
    this._sprintName = sprintName;
  }

  updateSprintStatus(sprintStatus: SprintStatus): void {
    this._sprintStatus = sprintStatus;
  }

  updateHoursDay(HoursDay: number): void {
    this._HoursDay = HoursDay;
  }

  updateUserIds(userIds: ListOfUsers[]): void {
    this._userIds = userIds;
  }

  updateCalculatedHoursPerDay(calculatedHoursPerDay: number): void {
    this._calculatedHoursPerDay = calculatedHoursPerDay;
  }

}
