import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { type ProjectRepository } from '../../infrastracture/repositories/project.repository';
import { PROJECT_REPOSITORY } from '../../domain/constants/project.constants';
import { Project as ProjectEntity } from '../../domain/entities/project.entity';
import { ProjectNotFoundError } from '../../presentation/errors/project-not-found';
import { PutProjectDto } from '../api/dto/request/put-project-dto';
import { USER_REPOSITORY } from 'src/features/users/domain/constants/user.constants';
import { type UserRepository } from 'src/features/users/infrastracture/repositories/user.repository';
import { ProjectMemberRole } from '../../domain/enums/project-member-role.enum';

@Injectable()
export class PutProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string, dto: PutProjectDto): Promise<ProjectEntity> {
    const projectExist = await this.projectRepository.findById(id);

    if (!projectExist) {
      throw new ProjectNotFoundError(id);
    }

    if (dto.memberIds) {
      await this.validateMembers(dto.memberIds);
    }

    const updatedProject = await this.projectRepository.put(id, dto);

    if (!updatedProject) {
      throw new ProjectNotFoundError(id);
    }

    if (dto.memberIds) {
      await this.projectRepository.replaceMembers(
        id,
        dto.memberIds,
        ProjectMemberRole.MEMBER,
      );
      const projectWithMembers = await this.projectRepository.findById(id);
      if (projectWithMembers) {
        return projectWithMembers;
      }
    }

    return updatedProject;
  }

  private async validateMembers(memberIds: string[]): Promise<void> {
    const users = await this.userRepository.findByIds(memberIds);
    const userMap = new Map(users.map((user) => [user.id, user]));

    for (const memberId of memberIds) {
      const user = userMap.get(memberId);
      if (!user) {
        throw new BadRequestException(`User with ID '${memberId}' does not exist`);
      }
      if (user.role === 'ADMIN') {
        throw new BadRequestException(
          `User '${user.name}' has role 'ADMIN' and cannot be added as a project member.`,
        );
      }
    }
  }
}
