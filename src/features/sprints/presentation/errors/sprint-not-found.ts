export class SprintNotFoundError extends Error {
  constructor(sprintId: string) {
    super(`Sprint with id '${sprintId}' not found`);
    this.name = 'SprintNotFoundError';
  }
}
