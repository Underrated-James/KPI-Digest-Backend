import { CreateUserDto } from './dtos/request/create-user-dto';
import { UpdateUserDto } from './dtos/request/update-user-dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './infrastracture/persistence/schema/user-schema';
import { Model, isValidObjectId } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) { }

  private validateObjectId(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid MongoDB ObjectId: ${id}`);
    }
  }
}
