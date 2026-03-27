import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProjectRepository } from '../../infrastracture/repositories/project.repository';
import { Project as ProjectsEntity } from '../../domain/entities/project.entity';
import {
  Project as ProjectSchema,
  ProjectDocument,
} from '../../domain/schema/project-schema';
import { ProjectStatus } from '../../domain/enums/project-status-enums';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';

@Injectable()
export class ProjectMongooseRepository implements ProjectRepository {
  constructor(
    @InjectModel(ProjectSchema.name)
    private readonly ProjectModel: Model<ProjectDocument>,
  ) { }

  //Get All Projects with Pagination (page is 1-indexed)
  async findAllPaginated(page: number, size: number, status?: ProjectStatus): Promise<PaginatedResult<ProjectsEntity>> {
    const query = status ? { status } : {};
    const skip = (page - 1) * size; // Zero-Index Trap: page 1 → skip 0

    // Run count + paginated fetch in parallel for performance
    const [totalElements, docs] = await Promise.all([
      this.ProjectModel.countDocuments(query).exec(),
      this.ProjectModel.find(query).skip(skip).limit(size).exec(),
    ]);

    const content = docs.map((doc) => this.toEntity(doc));
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

  private toEntity(doc: ProjectDocument): ProjectsEntity {
    return new ProjectsEntity(
      doc._id.toString(),
      doc.name,
      doc.status,
      doc.finishDate,
      doc.createdAt,
      doc.updatedAt,
    );
  }

  // Create Project
  async create(project: ProjectsEntity): Promise<ProjectsEntity> {
    const createdProject = new this.ProjectModel({
      name: project.name,
      status: project.status,
      finishDate: project.finishDate,
    });
    const doc = await createdProject.save();
    return this.toEntity(doc);
  }

  //Get All Prooject (filter with status optional)
  async findAll(status?: ProjectStatus): Promise<ProjectsEntity[]> {
    const query = status ? { status } : {};
    const docs = await this.ProjectModel.find(query).exec();
    return docs.map((doc) => this.toEntity(doc));
  }

  //Get Project by ID
  async findById(id: string): Promise<ProjectsEntity | null> {
    const doc = await this.ProjectModel.findById(id).exec();
    return doc ? this.toEntity(doc) : null;
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

    const doc = await this.ProjectModel
      .findByIdAndUpdate(id, updateData, { returnDocument: 'after' })
      .exec();
    return doc ? this.toEntity(doc) : null;
  }

  //PUT Project by ID
  async put(id: string, project: ProjectsEntity): Promise<ProjectsEntity | null> {
    const updateData = {
      name: project.name,
      status: project.status,
      finishDate: project.finishDate,
    };

    const doc = await this.ProjectModel
      .findByIdAndUpdate(id, updateData, {
        returnDocument: 'after',
        overwrite: true,
        runValidators: true,
      })
      .exec();

    return doc ? this.toEntity(doc) : null;
  }

  //Delete Project by ID
  async delete(id: string): Promise<void> {
    await this.ProjectModel.findByIdAndDelete(id).exec();
  }

  //Find Project by Name
  async findByName(name: string): Promise<ProjectsEntity | null> {
    const doc = await this.ProjectModel.findOne({ name }).exec();
    return doc ? this.toEntity(doc) : null;
  }
}
