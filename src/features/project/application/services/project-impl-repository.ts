import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProjectRepository } from '../../infrastracture/repositories/project.repository';
import { Project as ProjectsEntity } from '../../domain/entities/project.entity';
import {
  ProjectDocument,
} from '../../infrastracture/models/project.model';
import {
  PROJECT_MEMBER_COLLECTION,
  PROJECT_MEMBER_MODEL,
  PROJECT_MODEL,
} from '../../domain/constants/project.constants';
import { SPRINT_COLLECTION } from '../../../sprints/domain/constants/sprint.constants';
import { ProjectStatus } from '../../domain/enums/project-status-enums';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { toEntity } from '../../infrastracture/mappers/project-mapper';
import {
  ProjectMemberDocument,
} from '../../infrastracture/models/project-member.model';
import { USER_COLLECTION } from 'src/features/users/domain/constants/user.constants';
import { User } from 'src/features/users/domain/entities/user.entity';
import { ProjectMemberRole } from '../../domain/enums/project-member-role.enum';
import { toEntity as toUserEntity } from 'src/features/users/infrastracture/mappers/user-mapper';
@Injectable()
export class ProjectMongooseRepository implements ProjectRepository {
  constructor(
    @InjectModel(PROJECT_MODEL)
    private readonly projectModel: Model<ProjectDocument>,
    @InjectModel(PROJECT_MEMBER_MODEL)
    private readonly projectMemberModel: Model<ProjectMemberDocument>,
  ) { }

  private buildProjectAggregationPipeline(query: any): any[] {
    return [
      { $match: query },
      {
        $lookup: {
          from: SPRINT_COLLECTION,
          let: { projectId: { $toString: '$_id' } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$projectId', '$$projectId'] },
                    { $ne: ['$isDeleted', true] },
                  ],
                },
              },
            },
          ],
          as: 'sprints',
        },
      },
      {
        $lookup: {
          from: PROJECT_MEMBER_COLLECTION,
          let: { projectId: { $toString: '$_id' } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$projectId', '$$projectId'] },
              },
            },
            {
              $addFields: {
                userObjId: {
                  $convert: {
                    input: '$userId',
                    to: 'objectId',
                    onError: null,
                    onNull: null,
                  },
                },
              },
            },
            {
              $lookup: {
                from: USER_COLLECTION,
                localField: 'userObjId',
                foreignField: '_id',
                as: 'user',
              },
            },
            { $unwind: { path: '$user', preserveNullAndEmptyArrays: false } },
            {
              $match: {
                'user.isDeleted': { $ne: true },
              },
            },
            {
              $replaceRoot: {
                newRoot: '$user',
              },
            },
          ],
          as: 'members',
        },
      },
      {
        $addFields: {
          sprintCount: { $size: '$sprints' },
        },
      },
      {
        $project: {
          sprints: 0,
          __v: 0,
          'members.__v': 0,
          'members.isDeleted': 0,
          'members.deletedAt': 0,
        },
      },
    ];
  }

  private buildProjectMembersPipeline(projectId: string, role?: string): any[] {
    const matchStage: any = { projectId };

    return [
      { $match: matchStage },
      {
        $addFields: {
          userObjId: {
            $convert: {
              input: '$userId',
              to: 'objectId',
              onError: null,
              onNull: null,
            },
          },
        },
      },
      {
        $lookup: {
          from: USER_COLLECTION,
          localField: 'userObjId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: false } },
      {
        $match: {
          'user.isDeleted': { $ne: true },
          ...(role ? { 'user.role': role } : {}),
        },
      },
      {
        $replaceRoot: {
          newRoot: '$user',
        },
      },
      {
        $project: {
          __v: 0,
          isDeleted: 0,
          deletedAt: 0,
        },
      },
    ];
  }

  //Get All Projects with Pagination (page is 1-indexed)
  async findAllPaginated(page: number, size: number, status?: ProjectStatus, search?: string): Promise<PaginatedResult<ProjectsEntity>> {
    const query: any = { isDeleted: { $ne: true } };
    if (status) query.status = status;


    if (search) {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(safeSearch, 'i');
      query.$or = [{ name: regex }];
    }

    const skip = (page - 1) * size; // Zero-Index Trap: page 1 → skip 0

    const pipeline: any[] = [
      ...this.buildProjectAggregationPipeline(query),
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: size },
    ];

    // Run count + paginated fetch in parallel for performance
    const [totalElements, docs] = await Promise.all([
      this.projectModel.countDocuments(query).exec(),
      this.projectModel.aggregate(pipeline).exec(),
    ]);


    const content = docs.map((doc) => toEntity(doc));
    const totalPages = Math.ceil(totalElements / size);

    return {
      content,
      page,
      size,
      totalElements,
      totalPages,
      numberOfElements: content.length,
      firstPage: page === 1,
      lastPage: page >= totalPages,
    };
  }
  // Create Project
  async create(project: ProjectsEntity): Promise<ProjectsEntity> {
    const createdProject = new this.projectModel({
      name: project.name,
      status: project.status,
      finishDate: project.finishDate,
      ownerIds: project.ownerIds,
      createdBy: project.createdBy,
    });
    const doc = await createdProject.save();
    return this.findById(doc._id.toString()) as Promise<ProjectsEntity>;
  }

  //Get All Prooject (filter with status optional)
  async findAll(status?: ProjectStatus, search?: string): Promise<ProjectsEntity[]> {
    const query: any = { isDeleted: { $ne: true } };
    if (status) query.status = status;
    if (search) {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(safeSearch, 'i');
      query.$or = [{ name: regex }];
    }

    const docs = await this.projectModel
      .aggregate(this.buildProjectAggregationPipeline(query))
      .exec();
    return docs.map((doc) => toEntity(doc));
  }


  //Get Project by ID
  async findById(id: string): Promise<ProjectsEntity | null> {
    const query = {
      _id: Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id,
    };
    const docs = await this.projectModel
      .aggregate(this.buildProjectAggregationPipeline(query))
      .exec();
    return docs.length > 0 ? toEntity(docs[0]) : null;
  }

  // Patch Project by ID
  async patch(
    id: string,
    project: Partial<ProjectsEntity>,
  ): Promise<ProjectsEntity | null> {
    const updateData: any = {};
    if (project.name !== undefined) updateData.name = project.name;
    if (project.status !== undefined) updateData.status = project.status;
    if (project.finishDate !== undefined) updateData.finishDate = project.finishDate;
    if (project.ownerIds !== undefined) updateData.ownerIds = project.ownerIds;
    if (project.createdBy !== undefined) updateData.createdBy = project.createdBy;

    const doc = await this.projectModel
      .findByIdAndUpdate(id, updateData, { returnDocument: 'after' })
      .exec();
    return doc ? this.findById(id) : null;
  }

  //PUT Project by ID
  async put(id: string, project: ProjectsEntity): Promise<ProjectsEntity | null> {
    const updateData = {
      name: project.name,
      status: project.status,
      finishDate: project.finishDate,
      ownerIds: project.ownerIds || [],
      createdBy: project.createdBy,
    };

    const doc = await this.projectModel
      .findByIdAndUpdate(id, updateData, {
        returnDocument: 'after',
        overwrite: true,
        runValidators: true,
      })
      .exec();

    return doc ? this.findById(id) : null;
  }

  //Delete Project by ID
  async delete(id: string): Promise<void> {
    await this.projectModel.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date(),
    }).exec();
  }

  //Find Project by Name
  async findByName(name: string): Promise<ProjectsEntity | null> {
    const doc = await this.projectModel.findOne({ name }).exec();
    return doc ? toEntity(doc) : null;
  }

  //Restore Project by ID
  async restore(id: string): Promise<void> {
    await this.projectModel.findByIdAndUpdate(id, {
      $set: { isDeleted: false },
      $unset: { deletedAt: 1 }
    }).exec();
  }

  //Hard Delete Project by ID
  async hardDelete(id: string): Promise<void> {
    await this.projectMemberModel.deleteMany({ projectId: id }).exec();
    await this.projectModel.findByIdAndDelete(id).exec();
  }

  async getMembers(projectId: string): Promise<User[]> {
    const docs = await this.projectMemberModel
      .aggregate(this.buildProjectMembersPipeline(projectId))
      .exec();
    return docs.map((doc) => toUserEntity(doc));
  }

  async getMembersByRole(projectId: string, role: string): Promise<User[]> {
    const docs = await this.projectMemberModel
      .aggregate(this.buildProjectMembersPipeline(projectId, role))
      .exec();
    return docs.map((doc) => toUserEntity(doc));
  }

  async addMember(
    projectId: string,
    userId: string,
    role: ProjectMemberRole = ProjectMemberRole.MEMBER,
  ): Promise<void> {
    await this.projectMemberModel
      .updateOne(
        { projectId, userId },
        {
          $setOnInsert: {
            projectId,
            userId,
            role,
            joinedAt: new Date(),
          },
        },
        { upsert: true },
      )
      .exec();
  }

  async removeMember(projectId: string, userId: string): Promise<void> {
    await this.projectMemberModel.deleteOne({ projectId, userId }).exec();
  }

  async replaceMembers(
    projectId: string,
    userIds: string[],
    role: ProjectMemberRole = ProjectMemberRole.MEMBER,
  ): Promise<void> {
    const uniqueUserIds = [...new Set(userIds)];

    if (!uniqueUserIds.length) {
      await this.projectMemberModel.deleteMany({ projectId }).exec();
      return;
    }

    await this.projectMemberModel
      .deleteMany({ projectId, userId: { $nin: uniqueUserIds } })
      .exec();

    const operations = uniqueUserIds.map((userId) => ({
      updateOne: {
        filter: { projectId, userId },
        update: {
          $setOnInsert: {
            projectId,
            userId,
            role,
            joinedAt: new Date(),
          },
        },
        upsert: true,
      },
    }));

    if (operations.length) {
      await this.projectMemberModel.bulkWrite(operations);
    }
  }

  async isMember(projectId: string, userId: string): Promise<boolean> {
    const count = await this.projectMemberModel.countDocuments({
      projectId,
      userId,
    });
    return count > 0;
  }
}
