import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SprintRepository } from '../../infrastracture/repository/sprint-overview-repository';
import { SprintOverviewEntity } from '../../domain/entities/sprint-overview-entity';
import {
  SprintOverviewDocument,
} from '../../infrastracture/models/sprint-overview.model';
import { SPRINT_OVERVIEW_MODEL } from '../../domain/constants/sprint-overview-constants';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { toEntity, toModel } from '../../infrastracture/mappers/sprint-overview-mappers';

@Injectable()
export class SprintMongooseRepository implements SprintRepository {
  constructor(
    @InjectModel(SPRINT_OVERVIEW_MODEL)
    private readonly sprintOverviewModel: Model<SprintOverviewDocument>,
  ) { }

  async create(entity: SprintOverviewEntity): Promise<SprintOverviewEntity> {
    const modelData = toModel(entity);
    const createdDoc = new this.sprintOverviewModel(modelData);
    const doc = await createdDoc.save();
    return toEntity(doc);
  }

  async findAll(projectId?: string, sprintId?: string, search?: string): Promise<SprintOverviewEntity[]> {
    const query: any = { isDeleted: { $ne: true } };
    if (projectId) query.projectId = projectId;
    if (sprintId) query.sprintId = sprintId;
    if (search) {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(safeSearch, 'i');
      query.$or = [{ sprintName: regex }, { projectName: regex }];
    }

    const docs = await this.sprintOverviewModel.find(query).exec();
    return docs.map(doc => toEntity(doc));
  }

  async findAllPaginated(
    page: number,
    size: number,
    projectId?: string,
    sprintId?: string,
    search?: string,
  ): Promise<PaginatedResult<SprintOverviewEntity>> {
    const query: any = { isDeleted: { $ne: true } };
    if (projectId) query.projectId = projectId;
    if (sprintId) query.sprintId = sprintId;
    if (search) {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(safeSearch, 'i');
      query.$or = [{ sprintName: regex }, { projectName: regex }];
    }

    const skip = (page - 1) * size;
    const [totalElements, docs] = await Promise.all([
      this.sprintOverviewModel.countDocuments(query).exec(),
      this.sprintOverviewModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(size).exec(),
    ]);

    const totalPages = Math.ceil(totalElements / size);

    return {
      content: docs.map(doc => toEntity(doc)),
      page,
      size,
      totalElements,
      totalPages,
      numberOfElements: docs.length,
      firstPage: page === 1,
      lastPage: page >= totalPages,
    };
  }

  async findById(id: string): Promise<SprintOverviewEntity | null> {
    const doc = await this.sprintOverviewModel.findOne({
      _id: Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id,
      isDeleted: { $ne: true }
    }).exec();
    return doc ? toEntity(doc) : null;
  }

  async patch(id: string, entity: Partial<SprintOverviewEntity>): Promise<SprintOverviewEntity | null> {
    const updateData: any = {};
    Object.keys(entity).forEach(key => {
      if (key.startsWith('_')) {
        updateData[key.substring(1)] = (entity as any)[key];
      } else {
        updateData[key] = (entity as any)[key];
      }
    });

    const doc = await this.sprintOverviewModel.findOneAndUpdate(
      { _id: Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id },
      { $set: updateData },
      { new: true }
    ).exec();
    return doc ? toEntity(doc) : null;
  }

  async put(id: string, entity: SprintOverviewEntity): Promise<SprintOverviewEntity | null> {
    const modelData = toModel(entity);
    const doc = await this.sprintOverviewModel.findOneAndUpdate(
      { _id: Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id },
      { $set: modelData },
      { new: true }
    ).exec();
    return doc ? toEntity(doc) : null;
  }

  async delete(id: string): Promise<void> {
    await this.sprintOverviewModel.updateOne(
      { _id: Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id },
      { $set: { isDeleted: true, deletedAt: new Date() } }
    ).exec();
  }

  async restore(id: string): Promise<void> {
    await this.sprintOverviewModel.updateOne(
      { _id: Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id },
      { $set: { isDeleted: false, deletedAt: null } }
    ).exec();
  }

  async hardDelete(id: string): Promise<void> {
    await this.sprintOverviewModel.deleteOne({
      _id: Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id
    }).exec();
  }
}
