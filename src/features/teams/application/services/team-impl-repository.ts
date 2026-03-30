import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TeamRepository } from '../../infrastracture/repository/team-repository';
import { Team as TeamEntity } from '../../domain/entities/team.entity';
import { TeamDocument } from '../../infrastracture/models/team.model';
import { TEAM_MODEL } from '../../domain/constants/team.constants';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { toEntity } from '../../infrastracture/mappers/team-mappers';
import { PROJECT_COLLECTION } from 'src/features/project/domain/constants/project.constants';
import { SPRINT_COLLECTION } from 'src/features/sprints/domain/constants/sprint.constants';
import { USER_COLLECTION } from 'src/features/users/domain/constants/user.constants';
@Injectable()
export class TeamMongooseRepository implements TeamRepository {
  constructor(
    @InjectModel(TEAM_MODEL)
    private readonly teamModel: Model<TeamDocument>,
  ) { }

  private getAggregationPipeline(query: any): any[] {
    return [
      { $match: query },
      {
        $addFields: {
          projectObjId: { $toObjectId: '$projectId' },
          sprintObjId: { $toObjectId: '$sprintId' }
        }
      },
      {
        $lookup: {
          from: PROJECT_COLLECTION,
          localField: 'projectObjId',
          foreignField: '_id',
          as: 'project'
        }
      },
      { $unwind: { path: '$project', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: SPRINT_COLLECTION,
          localField: 'sprintObjId',
          foreignField: '_id',
          as: 'sprint'
        }
      },
      { $unwind: { path: '$sprint', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$userIds', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          userObjId: { $toObjectId: '$userIds.userId' }
        }
      },
      {
        $lookup: {
          from: USER_COLLECTION,
          localField: 'userObjId',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          'userIds.name': '$userInfo.name',
          'userIds.role': '$userInfo.role'
        }
      },
      {
        $group: {
          _id: '$_id',
          projectId: { $first: '$projectId' },
          sprintId: { $first: '$sprintId' },
          calculatedHoursPerDay: { $first: '$calculatedHoursPerDay' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          projectName: { $first: '$project.name' },
          projectStatus: { $first: '$project.status' },
          sprintName: { $first: '$sprint.name' },
          sprintStatus: { $first: '$sprint.status' },
          HoursDay: { $first: '$sprint.workingHoursDay' },
          userIds: {
            $push: {
              $cond: [
                { $gt: ['$userIds', null] },
                '$userIds',
                '$$REMOVE'
              ]
            }
          }
        }
      }
    ];
  }

  async findAllPaginated(page: number, size: number, sprintId?: string, projectId?: string): Promise<PaginatedResult<TeamEntity>> {
    const query: any = {};
    if (sprintId) query.sprintId = sprintId;
    if (projectId) query.projectId = projectId;

    const totalElements = await this.teamModel.countDocuments(query).exec();
    const skip = (page - 1) * size;

    const pipeline = [
      ...this.getAggregationPipeline(query),
      { $skip: skip },
      { $limit: size }
    ];

    const docs = await this.teamModel.aggregate(pipeline).exec();
    const content = docs.map((doc) => toEntity(doc));

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

  async create(team: TeamEntity): Promise<TeamEntity> {
    const createdTeam = new this.teamModel({
      projectId: team.projectId,
      sprintId: team.sprintId,
      calculatedHoursPerDay: team.calculatedHoursPerDay,
      userIds: team.userIds.map(u => ({
        userId: u.userId,
        allocationPercentage: u.allocationPercentage,
        leave: u.leave
      })),
    });
    const doc = await createdTeam.save();
    return this.findById(doc._id.toString()) as Promise<TeamEntity>;
  }

  async findAll(sprintId?: string, projectId?: string): Promise<TeamEntity[]> {
    const query: any = {};
    if (sprintId) query.sprintId = sprintId;
    if (projectId) query.projectId = projectId;

    const docs = await this.teamModel.aggregate(this.getAggregationPipeline(query)).exec();
    return docs.map((doc) => toEntity(doc));
  }

  async findById(id: string): Promise<TeamEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const query = { _id: new Types.ObjectId(id) };
    const docs = await this.teamModel.aggregate(this.getAggregationPipeline(query)).exec();
    return docs.length > 0 ? toEntity(docs[0]) : null;
  }

  async findByName(name: string): Promise<TeamEntity | null> {
    const pipeline = [
      ...this.getAggregationPipeline({}),
      {
        $match: {
          $or: [
            { projectName: { $regex: name, $options: 'i' } },
            { sprintName: { $regex: name, $options: 'i' } }
          ]
        }
      }
    ];
    const docs = await this.teamModel.aggregate(pipeline).exec();
    return docs.length > 0 ? toEntity(docs[0]) : null;
  }

  async patch(id: string, team: Partial<TeamEntity>): Promise<TeamEntity | null> {
    const updateData: any = {};
    if (team.userIds) {
      updateData.userIds = team.userIds.map(u => ({
        userId: u.userId,
        allocationPercentage: u.allocationPercentage,
        leave: u.leave
      }));
    }
    if (team.calculatedHoursPerDay !== undefined) updateData.calculatedHoursPerDay = team.calculatedHoursPerDay;

    await this.teamModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    return this.findById(id);
  }

  async put(id: string, team: Partial<TeamEntity>): Promise<TeamEntity | null> {
    const updateData: any = {
      projectId: team.projectId,
      sprintId: team.sprintId,
      calculatedHoursPerDay: team.calculatedHoursPerDay,
      userIds: team.userIds?.map(u => ({
        userId: u.userId,
        allocationPercentage: u.allocationPercentage,
        leave: u.leave
      })),
    };

    await this.teamModel.findByIdAndUpdate(id, updateData, { new: true, overwrite: true }).exec();
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.teamModel.findByIdAndDelete(id).exec();
  }
}
