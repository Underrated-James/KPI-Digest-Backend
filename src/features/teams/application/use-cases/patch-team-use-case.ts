import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { type TeamRepository } from '../../infrastracture/repository/team-repository';
import { Team as TeamEntity } from '../../domain/entities/team.entity';
import { PatchTeamDto } from '../api/dto/request/patch-team.dto';
import { type SprintRepository } from '../../../sprints/infrastracture/repository/sprint-repository';
import { type UserRepository } from '../../../users/infrastracture/repositories/user.repository';

@Injectable()
export class PatchTeamUseCase {
  constructor(
    @Inject('TeamRepository')
    private readonly teamRepository: TeamRepository,
    @Inject('SprintRepository')
    private readonly sprintRepository: SprintRepository,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string, dto: PatchTeamDto): Promise<TeamEntity> {
    const team = await this.teamRepository.findById(id);
    if (!team) {
      throw new NotFoundException(`Team with id '${id}' not found`);
    }

    // If userIds are being updated, validate that all users exist
    if (dto.userIds) {
      const userIdsList = dto.userIds.map(u => u.userId);
      const existingUsers = await this.userRepository.findByIds(userIdsList);
      const userMap = new Map(existingUsers.map(u => [u.id, u]));

      for (const userEntry of dto.userIds) {
        const dbUser = userMap.get(userEntry.userId);
        if (!dbUser) {
          throw new BadRequestException(`User with ID '${userEntry.userId}' does not exist`);
        }
        if (dbUser.name !== userEntry.name) {
          throw new BadRequestException(
            `Name mismatch for user ID '${userEntry.userId}': expected '${dbUser.name}', got '${userEntry.name}'`
          );
        }
        if (dbUser.role !== userEntry.role) {
          throw new BadRequestException(
            `Role mismatch for user ID '${userEntry.userId}': expected '${dbUser.role}', got '${userEntry.role}'`
          );
        }
      }
    }

    // If either sprintId or userIds (with leaves) are being updated, we need to validate
    const sprintId = dto.sprintId || team.sprintId;
    const userIds = dto.userIds || team.userIds;

    if (dto.userIds || dto.sprintId) {
      const sprint = await this.sprintRepository.findById(sprintId);
      if (!sprint) {
        throw new NotFoundException(`Sprint with ID ${sprintId} not found`);
      }

      // Validate each user's leave date against the sprint's start and end date
      userIds.forEach((user) => {
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
                `Leave date '${leave.leaveDate.toISOString().split('T')[0]}' for user '${user.name}' is outside the sprint range (${sprint.startDate.toISOString().split('T')[0]} to ${sprint.endDate.toISOString().split('T')[0]})`
              );
            }
          });
        }
      });
    }

    const updatedTeam = await this.teamRepository.patch(id, dto);
    if (!updatedTeam) {
        throw new NotFoundException(`Team with id '${id}' not found after update`);
    }
    return updatedTeam;
  }
}

