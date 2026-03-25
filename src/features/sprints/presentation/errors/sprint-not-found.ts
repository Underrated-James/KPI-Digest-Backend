import { NotFoundException } from '@nestjs/common';

export class SprintNotFoundError extends NotFoundException {
  constructor(sprintId: string) {
    super(`Sprint with id '${sprintId}' not found`);
  }
}
