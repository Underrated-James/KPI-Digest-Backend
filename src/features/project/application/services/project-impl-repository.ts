import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProjectRepository } from '../../infrastracture/repositories/project.repository';
import { Project as ProjectsEntity } from '../../domain/entities/project.entity';
import {
  ProjectDocument,
} from '../../infrastracture/models/project.model';
import { PROJECT_MODEL } from '../../domain/constants/project.constants';
import { SPRINT_COLLECTION } from '../../../sprints/domain/constants/sprint.constants';
import { ProjectStatus } from '../../domain/enums/project-status-enums';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { toEntity } from '../../infrastracture/mappers/project-mapper';
@Injectable()
export class ProjectMongooseRepository implements ProjectRepository {
  constructor(
    @InjectModel(PROJECT_MODEL)
    private readonly projectModel: Model<ProjectDocument>,
  ) { }

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

    // Build aggregation pipeline for counting sprints
    const pipeline: any[] = [
      { $match: query },
      {
        $lookup: {
          from: SPRINT_COLLECTION,
          let: { projectId: { $toString: "$_id" } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$projectId", "$$projectId"] },
                    { $ne: ["$isDeleted", true] }
                  ]
                }
              }
            }
          ],
          as: "sprints"
        }
      },
      {
        $addFields: {
          sprintCount: { $size: "$sprints" }
        }
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: size },
      { $project: { sprints: 0, __v: 0 } }
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
    });
    const doc = await createdProject.save();
    return toEntity(doc);
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

    const pipeline: any[] = [
      { $match: query },
      {
        $lookup: {
          from: SPRINT_COLLECTION,
          let: { projectId: { $toString: "$_id" } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$projectId", "$$projectId"] },
                    { $ne: ["$isDeleted", true] }
                  ]
                }
              }
            }
          ],
          as: "sprints"
        }
      },
      {
        $addFields: {
          sprintCount: { $size: "$sprints" }
        }
      },
      { $project: { sprints: 0, __v: 0 } }
    ];

    const docs = await this.projectModel.aggregate(pipeline).exec();
    return docs.map((doc) => toEntity(doc));
  }


  //Get Project by ID
  async findById(id: string): Promise<ProjectsEntity | null> {
    const pipeline: any[] = [
      { $match: { _id: Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id } },
      {
        $lookup: {
          from: SPRINT_COLLECTION,
          let: { projectId: { $toString: "$_id" } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$projectId", "$$projectId"] },
                    { $ne: ["$isDeleted", true] }
                  ]
                }
              }
            }
          ],
          as: "sprints"
        }
      },
      {
        $addFields: {
          sprintCount: { $size: "$sprints" }
        }
      },
      { $project: { sprints: 0, __v: 0 } }
    ];

    const docs = await this.projectModel.aggregate(pipeline).exec();
    return docs.length > 0 ? toEntity(docs[0]) : null;
  }

  // Patch Project by ID
  async patch(
    id: string,
    project: Partial<ProjectsEntity>,
  ): Promise<ProjectsEntity | null> {
    const updateData: any = {};
    if (project.name) updateData.name = project.name;
    if (project.status) updateData.status = project.status;
    if (project.finishDate) updateData.finishDate = project.finishDate;

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
      deletedAt: new Date()
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
    await this.projectModel.findByIdAndDelete(id).exec();
  }
}
