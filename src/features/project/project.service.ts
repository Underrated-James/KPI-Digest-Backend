import {
  Injectable
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Project, ProjectDocument } from './domain/schema/project-schema';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private readonly projectModel: Model<ProjectDocument>,
  ) { }

}
