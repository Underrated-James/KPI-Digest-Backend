import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SprintRepository } from '../../infrastracture/repository/sprint-repository';
import { Sprint as SprintEntity } from '../../domain/entities/sprint-entity';
import {
  SprintDocument,
} from '../../infrastracture/models/sprint.model';
import { SPRINT_MODEL } from '../../domain/constants/sprint.constants';
import { SprintStatus } from '../../domain/enums/sprint-status-enums';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { toEntity } from '../../infrastracture/mappers/sprint-mappers';

@Injectable()
export class SprintMongooseRepository implements SprintRepository {
  constructor(
    @InjectModel(SPRINT_MODEL)
    private readonly sprintModel: Model<SprintDocument>,
  ) { }
  // Get all Sprint Paginated 
  async findAllPaginated(page: number, size: number, status?: SprintStatus, projectId?: string): Promise<PaginatedResult<SprintEntity>> {
    const query: any = {};
    if (status) query.status = status;
    if (projectId) query.projectId = projectId;
    const skip = (page - 1) * size;

    const docs = await this.sprintModel.find(query).skip(skip).limit(size).exec();
    const totalElements = await this.sprintModel.countDocuments(query).exec();
    const totalPages = Math.ceil(totalElements / size);
    const numberOfElements = docs.length;
    const firstPage = page === 1;
    const lastPage = page === totalPages;
    return {
      content: docs.map((doc) => toEntity(doc)),
      page,
      size,
      totalElements,
      totalPages,
      numberOfElements,
      firstPage,
      lastPage,
    };
  }

  // Create Sprint
  async create(sprint: SprintEntity): Promise<SprintEntity> {
    const createdSprint = new this.sprintModel({
      projectId: sprint.projectId,
      name: sprint.name,
      status: sprint.status,
      sprintDuration: sprint.sprintDuration,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      workingHoursDay: sprint.workingHoursDay,
      dayOff: sprint.dayOff,
      officialStartDate: sprint.officialStartDate,
      officialEndDate: sprint.officialEndDate,
    });
    const doc = await createdSprint.save();
    return toEntity(doc);
  }

  //Get All Sprint (filter with status optional)
  async findAll(status?: SprintStatus, projectId?: string): Promise<SprintEntity[]> {
    const query: any = {};
    if (status) query.status = status;
    if (projectId) query.projectId = projectId;

    const docs = await this.sprintModel.find(query).exec();
    return docs.map((doc) => toEntity(doc));
  }

  //Get Sprint by ID
  async findById(id: string): Promise<SprintEntity | null> {
    const doc = await this.sprintModel.findById(id).exec();
    return doc ? toEntity(doc) : null;
  }

  // Patch Sprint by ID
  async patch(
    id: string,
    project: Partial<SprintEntity>,
  ): Promise<SprintEntity | null> {
    const updateData: any = {};
    if (project.projectId) updateData.projectId = project.projectId;
    if (project.name) updateData.name = project.name;
    if (project.status) updateData.status = project.status;
    if (project.startDate) updateData.startDate = project.startDate;
    if (project.endDate) updateData.endDate = project.endDate;
    if (project.workingHoursDay) updateData.workingHoursDay = project.workingHoursDay;
    if (project.sprintDuration) updateData.sprintDuration = project.sprintDuration;
    if (project.dayOff) updateData.dayOff = project.dayOff;
    if (project.officialStartDate !== undefined) updateData.officialStartDate = project.officialStartDate;
    if (project.officialEndDate !== undefined) updateData.officialEndDate = project.officialEndDate;


    const doc = await this.sprintModel
      .findByIdAndUpdate(id, updateData, { returnDocument: 'after' })
      .exec();
    return doc ? toEntity(doc) : null;
  }

  //PUT Sprint by ID
  async put(id: string, sprint: SprintEntity): Promise<SprintEntity | null> {
    const updateData = {
      projectId: sprint.projectId,
      name: sprint.name,
      status: sprint.status,
      sprintDuration: sprint.sprintDuration,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      workingHoursDay: sprint.workingHoursDay,
      dayOff: sprint.dayOff,
      officialStartDate: sprint.officialStartDate,
      officialEndDate: sprint.officialEndDate,
    };

    const doc = await this.sprintModel
      .findByIdAndUpdate(id, updateData, {
        returnDocument: 'after',
        overwrite: true,
        runValidators: true,
      })
      .exec();

    return doc ? toEntity(doc) : null;
  }

  //Delete Sprint by ID
  async delete(id: string): Promise<void> {
    await this.sprintModel.findByIdAndDelete(id).exec();
  }

  //Find Sprint by Name
  async findByName(name: string): Promise<SprintEntity | null> {
    const doc = await this.sprintModel.findOne({ name }).exec();
    return doc ? toEntity(doc) : null;
  }
}
