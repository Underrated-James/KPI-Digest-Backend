import { NotFoundException } from '@nestjs/common';

export class ProjectNotFoundError extends NotFoundException {
    constructor(projectId: string) {
        super(`Project with id '${projectId}' not found`);
    }
}