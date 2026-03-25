import {
  Injectable
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Sprint, SprintDocument } from './domain/schema/sprint-schema';

@Injectable()
export class SprintService {
  constructor(
    @InjectModel(Sprint.name) private readonly sprintModel: Model<SprintDocument>,
  ) { }

}
