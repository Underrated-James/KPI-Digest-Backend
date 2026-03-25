import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SprintRepository } from '../../infrastracture/repository/sprint-repository';
import { Sprint as SprintEntity } from '../../domain/entities/sprint.entity';
import {
  Sprint as SprintSchema,
  SprintDocument,
} from '../../domain/schema/sprint-schema';
import { SprintStatus } from '../../domain/enums/sprint-status-enums';

@Injectable()
export class SprintMongooseRepository implements SprintRepository {
  constructor(
    @InjectModel(SprintSchema.name)
    private readonly SprintModel: Model<SprintDocument>,
  ) {}

  private toEntity(doc: SprintDocument): SprintEntity {
    return new SprintEntity(
      doc._id.toString(),
      doc.projectId,
      doc.name,
      doc.status,
      doc.startDate,
      doc.endDate,
      doc.workingHoursDay,
      doc.dayOff || [],
      doc.createdAt,
      doc.updatedAt
    );
  }

  // Create Sprint
  async create(sprint: SprintEntity): Promise<SprintEntity> {
    const createdSprint = new this.SprintModel({
      projectId: sprint.projectId,
      name: sprint.name,
      status: sprint.status,
      sprintDuration: sprint.sprintDuration,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      workingHoursDay: sprint.workingHoursDay,
      dayOff: sprint.dayOff,
    });
    const doc = await createdSprint.save();
    return this.toEntity(doc);
  }

  //Get All Sprint (filter with status optional)
  async findAll(status?: SprintStatus): Promise<SprintEntity[]> {
    const query = status ? { status } : {};
    const docs = await this.SprintModel.find(query).exec();
    return docs.map((doc) => this.toEntity(doc));
  }

  //Get Sprint by ID
  async findById(id: string): Promise<SprintEntity | null> {
    const doc = await this.SprintModel.findById(id).exec();
    return doc ? this.toEntity(doc) : null;
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
    if (project.dayOff) updateData.dayOff = project.dayOff;

    // Recalculate duration if dates or dayOff changed
    if (project.startDate || project.endDate || project.dayOff) {
      // We need the full entity to calculate duration properly if only one field is provided
      const current = await this.findById(id);
      if (current) {
        const tempEntity = new SprintEntity(
          id,
          project.projectId || current.projectId,
          project.name || current.name,
          project.status || current.status,
          project.startDate || current.startDate,
          project.endDate || current.endDate,
          project.workingHoursDay || current.workingHoursDay,
          project.dayOff || current.dayOff
        );
        updateData.sprintDuration = tempEntity.sprintDuration;
      }
    }


    const doc = await this.SprintModel
      .findByIdAndUpdate(id, updateData, { returnDocument: 'after' })
      .exec();
    return doc ? this.toEntity(doc) : null;
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
    };

    const doc = await this.SprintModel
      .findByIdAndUpdate(id, updateData, {
        returnDocument: 'after',
        overwrite: true,
        runValidators: true,
      })
      .exec();

    return doc ? this.toEntity(doc) : null;
  }

  //Delete Sprint by ID
  async delete(id: string): Promise<void> {
    await this.SprintModel.findByIdAndDelete(id).exec();
  }

  //Find Sprint by Name
  async findByName(name: string): Promise<SprintEntity | null> {
    const doc = await this.SprintModel.findOne({ name }).exec();
    return doc ? this.toEntity(doc) : null;
  }
}
