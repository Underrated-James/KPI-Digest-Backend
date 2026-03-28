import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeamRepository } from '../../infrastracture/repository/team-repository';
import { Team as TeamEntity } from '../../domain/entities/team.entity';
import { Team as TeamSchema, TeamDocument } from '../../domain/schema/team-schema';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';

@Injectable()
export class TeamMongooseRepository implements TeamRepository {
  constructor(
    @InjectModel(TeamSchema.name)
    private readonly teamModel: Model<TeamDocument>,
  ) { }

  async findAllPaginated(page: number, size: number, sprintId?: string, projectId?: string): Promise<PaginatedResult<TeamEntity>> {
    const query: any = {};
    if (sprintId) query.sprintId = sprintId;
    if (projectId) query.projectId = projectId;

    const totalElements = await this.teamModel.countDocuments(query).exec();
    const skip = (page - 1) * size;
    const docs = await this.teamModel.find(query).skip(skip).limit(size).exec();
    const content = docs.map((doc) => this.toEntity(doc));

    return {
      content,
      page,
      size,
      totalElements,
      totalPages: Math.ceil(totalElements / size),
      numberOfElements: content.length,
      firstPage: page === 1,
      lastPage: page === Math.ceil(totalElements / size),

    };
  }

  private toEntity(doc: TeamDocument): TeamEntity {
    return new TeamEntity(
      doc._id.toString(),
      doc.projectId,
      doc.projectName,
      doc.projectStatus,
      doc.sprintId,
      doc.sprintName,
      doc.sprintStatus,
      doc.HoursDay,
      doc.userIds,
      doc.allocationPercentage,
      doc.calculatedHoursPerDay,
      doc.createdAt,
      doc.updatedAt,
    );
  }

  async create(team: TeamEntity): Promise<TeamEntity> {
    const createdTeam = new this.teamModel({
      projectId: team.projectId,
      projectName: team.projectName,
      projectStatus: team.projectStatus,
      sprintId: team.sprintId,
      sprintName: team.sprintName,
      sprintStatus: team.sprintStatus,
      HoursDay: team._HoursDay,
      userIds: team.userIds,
      allocationPercentage: team.allocationPercentage,
      calculatedHoursPerDay: team.calculatedHoursPerDay,
    });
    const doc = await createdTeam.save();
    return this.toEntity(doc);
  }

  async findAll(sprintId?: string, projectId?: string): Promise<TeamEntity[]> {
    const query: any = {};
    if (sprintId) query.sprintId = sprintId;
    if (projectId) query.projectId = projectId;

    const docs = await this.teamModel.find(query).exec();
    return docs.map((doc) => this.toEntity(doc));
  }

  async findById(id: string): Promise<TeamEntity | null> {
    const doc = await this.teamModel.findById(id).exec();
    return doc ? this.toEntity(doc) : null;
  }

  async findByName(name: string): Promise<TeamEntity | null> {
    const doc = await this.teamModel.findOne({
      $or: [{ projectName: name }, { sprintName: name }]
    }).exec();
    return doc ? this.toEntity(doc) : null;
  }

  async patch(id: string, team: Partial<TeamEntity>): Promise<TeamEntity | null> {
    const updateData: any = {};
    if (team._HoursDay !== undefined) updateData._HoursDay = team._HoursDay;
    if (team.userIds) updateData.userIds = team.userIds;
    if (team.allocationPercentage !== undefined) updateData.allocationPercentage = team.allocationPercentage;
    if (team.calculatedHoursPerDay !== undefined) updateData.calculatedHoursPerDay = team.calculatedHoursPerDay;

    const doc = await this.teamModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    return doc ? this.toEntity(doc) : null;
  }

  async put(id: string, team: Partial<TeamEntity>): Promise<TeamEntity | null> {
    const updateData: any = {
      projectId: team.projectId,
      projectName: team.projectName,
      projectStatus: team.projectStatus,
      sprintId: team.sprintId,
      sprintName: team.sprintName,
      sprintStatus: team.sprintStatus,
      HoursDay: team._HoursDay,
      userIds: team.userIds,
      allocationPercentage: team.allocationPercentage,
      calculatedHoursPerDay: team.calculatedHoursPerDay,
    };

    const doc = await this.teamModel
      .findByIdAndUpdate(id, updateData, { new: true, overwrite: true })
      .exec();
    return doc ? this.toEntity(doc) : null;
  }

  async delete(id: string): Promise<void> {
    await this.teamModel.findByIdAndDelete(id).exec();
  }
}
