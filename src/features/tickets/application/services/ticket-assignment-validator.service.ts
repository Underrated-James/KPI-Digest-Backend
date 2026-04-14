import {
  BadRequestException,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PROJECT_REPOSITORY } from 'src/features/project/domain/constants/project.constants';
import { type ProjectRepository } from 'src/features/project/infrastracture/repositories/project.repository';
import { USER_REPOSITORY } from 'src/features/users/domain/constants/user.constants';
import { type UserRepository } from 'src/features/users/infrastracture/repositories/user.repository';
import { Sprint } from 'src/features/sprints/domain/entities/sprint-entity';
import { Team } from 'src/features/teams/domain/entities/team.entity';

@Injectable()
export class TicketAssignmentValidatorService {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async assertProjectExists(projectId: string): Promise<void> {
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new BadRequestException('Project not found');
    }
  }

  validateSprint(
    sprintId: string | null | undefined,
    sprint: Sprint | null,
    projectId: string,
  ): void {
    if (!sprintId) {
      return;
    }

    if (!sprint) {
      throw new BadRequestException(`Sprint with ID ${sprintId} not found`);
    }

    if (sprint.projectId !== projectId) {
      throw new BadRequestException(
        `Project ID ${projectId} does not match the sprint's project ID ${sprint.projectId}`,
      );
    }
  }

  async validateAssignments(params: {
    projectId: string;
    assignedDevId?: string | null;
    assignedQaId?: string | null;
    team?: Team | null;
  }): Promise<void> {
    const { projectId, assignedDevId, assignedQaId, team } = params;

    await Promise.all([
      assignedDevId
        ? this.validateAssignment(projectId, assignedDevId, 'DEVS', 'Developer', team)
        : Promise.resolve(),
      assignedQaId
        ? this.validateAssignment(projectId, assignedQaId, 'QA', 'QA', team)
        : Promise.resolve(),
    ]);
  }

  private async validateAssignment(
    projectId: string,
    userId: string,
    expectedRole: 'DEVS' | 'QA',
    label: 'Developer' | 'QA',
    team?: Team | null,
  ): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnprocessableEntityException(
        `Assigned ${label} with ID ${userId} not found`,
      );
    }

    if (user.role !== expectedRole) {
      throw new UnprocessableEntityException(
        label === 'Developer'
          ? `User ${user.name} is not a Developer (Role: ${user.role})`
          : `User ${user.name} is not a QA (Role: ${user.role})`,
      );
    }

    const isProjectMember = await this.projectRepository.isMember(projectId, userId);
    if (isProjectMember) {
      return;
    }

    const isLegacyTeamMember =
      team?.users.some((member) => member.userId === userId) ?? false;

    if (isLegacyTeamMember) {
      await this.projectRepository.addMember(projectId, userId);
      return;
    }

    throw new UnprocessableEntityException(
      `User ${user.name} is not a member of Project: ${projectId}`,
    );
  }
}
