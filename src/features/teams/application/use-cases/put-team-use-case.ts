import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { type TeamRepository } from '../../infrastracture/repository/team-repository';
import { TEAM_REPOSITORY } from '../../domain/constants/team.constants';
import { SPRINT_REPOSITORY } from '../../../sprints/domain/constants/sprint.constants';
import { USER_REPOSITORY } from '../../../users/domain/constants/user.constants';
import { Team as TeamEntity } from '../../domain/entities/team.entity';
import { PutTeamDto } from '../api/dto/request/put-team.dto';
import { type SprintRepository } from '../../../sprints/infrastracture/repository/sprint-repository';
import { type UserRepository } from '../../../users/infrastracture/repositories/user.repository';

@Injectable()
export class PutTeamUseCase {
  constructor(
    @Inject(TEAM_REPOSITORY)
    private readonly teamRepository: TeamRepository,
    @Inject(SPRINT_REPOSITORY)
    private readonly sprintRepository: SprintRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string, dto: PutTeamDto): Promise<TeamEntity> {
    const team = await this.teamRepository.findById(id);
    if (!team) {
      throw new NotFoundException(`Team with id '${id}' not found`);
    }

    // Validate that all users exist
    const userIdsList = dto.userIds.map(u => u.userId);
    const existingUsers = await this.userRepository.findByIds(userIdsList);
    const userMap = new Map(existingUsers.map(u => [u.id, u]));

    for (const userEntry of dto.userIds) {
      const dbUser = userMap.get(userEntry.userId);
      if (!dbUser) {
        throw new BadRequestException(`User with ID '${userEntry.userId}' does not exist`);
      }
    }

    const sprint = await this.sprintRepository.findById(dto.sprintId);
    if (!sprint) {
      throw new NotFoundException(`Sprint with ID ${dto.sprintId} not found`);
    }

    // Validate each user's leave date against the sprint's start and end date
    dto.userIds.forEach((user) => {
      if (user.leave && user.leave.length > 0) {
        user.leave.forEach((leave) => {
          const leaveDate = new Date(leave.leaveDate);
          const sprintStart = new Date(sprint.startDate);
          const sprintEnd = new Date(sprint.endDate);

          // Clear time for date-only comparison
          leaveDate.setHours(0, 0, 0, 0);
          sprintStart.setHours(0, 0, 0, 0);
          sprintEnd.setHours(0, 0, 0, 0);

          if (leaveDate < sprintStart || leaveDate > sprintEnd) {
            throw new BadRequestException(
              `Leave date '${leave.leaveDate.toISOString().split('T')[0]}' for user '${user.userId}' is outside the sprint range (${sprint.startDate.toISOString().split('T')[0]} to ${sprint.endDate.toISOString().split('T')[0]})`
            );
          }
        });
      }
    });

    const teamEntity = new TeamEntity(
      id,
      dto.projectId,
      dto.sprintId,
      dto.userIds.map(u => ({
        userId: u.userId,
        allocationPercentage: u.allocationPercentage,
        hoursPerDay: u.hoursPerDay,
        role: u.role,
        leave: u.leave
      }))
    );

    const updatedTeam = await this.teamRepository.put(id, teamEntity);
    if (!updatedTeam) {
        throw new NotFoundException(`Team with id '${id}' not found after update`);
    }
    return updatedTeam;
  }
}

