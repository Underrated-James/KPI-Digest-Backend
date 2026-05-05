import { NotFoundException } from '@nestjs/common';

export class SprintOverviewNotFoundError extends NotFoundException {
  constructor(sprintId: string) {
    super(`Sprint overview with id '${sprintId}' not found`);
  }
}
