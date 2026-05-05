import { SprintOverviewEntity } from "../../domain/entities/sprint-overview-entity";

export function toEntity(doc: any): SprintOverviewEntity {
  return new SprintOverviewEntity(
    doc._id.toString(),
    doc.projectId,
    doc.projectName,
    doc.sprintId,
    doc.sprintName,
    doc.sprintStatus,
    doc.planningStatus,
    doc.planningStart,
    doc.planningEnd,
    doc.workingDays,
    doc.actualStart,
    doc.actualEnd,
    doc.teamRhythm,
    doc.holidays || [],
    doc.teamId,
    doc.finalizedAt,
    doc.finalizedBy,
    doc.summary,
    doc.memberMetrics || [],
    doc.sprintTickets || [],
    doc.isDeleted ?? false,
    doc.deletedAt ?? undefined,
    doc.createdAt ?? undefined,
    doc.updatedAt ?? undefined
  );
}

export function toModel(entity: SprintOverviewEntity): any {
  return {
    projectId: entity.projectId,
    projectName: entity.projectName,
    sprintId: entity.sprintId,
    sprintName: entity.sprintName,
    sprintStatus: entity.sprintStatus,
    planningStatus: entity.planningStatus,
    planningStart: entity.planningStart,
    planningEnd: entity.planningEnd,
    workingDays: entity.workingDays,
    actualStart: entity.actualStart,
    actualEnd: entity.actualEnd,
    teamRhythm: entity.teamRhythm,
    holidays: entity.holidays,
    teamId: entity.teamId,
    finalizedAt: entity.finalizedAt,
    finalizedBy: entity.finalizedBy,
    summary: entity.summary,
    memberMetrics: entity.memberMetrics,
    sprintTickets: entity.sprintTickets,
    isDeleted: entity.isDeleted,
    deletedAt: entity.deletedAt,
  };
}
