export class ProjectNotFoundError extends Error {
    constructor(projectId: string) {
        super(`Project with id '${projectId}' not found`);
        this.name = 'ProjectNotFoundError';
    }
}