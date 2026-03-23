import { CreateUserDto } from './dtos/create-user-dto';
import { UpdateUserDto } from './dtos/update-user-dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user-schema';
import { Model, isValidObjectId } from 'mongoose';

export type UserRole = 'ADMIN' | 'DEVS' | 'QA';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  // Get All Users
  async findAll(role?: UserRole): Promise<User[]> {
    if (role) {
      return this.userModel.find({ role }).exec();
    }
    return this.userModel.find().exec();
  }

  // Get User by ID
  async findOne(id: string): Promise<User> {
    this.validateObjectId(id);

    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  //Create User
  async create(user: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  //Update
  async patch(id: string, updatedUser: UpdateUserDto): Promise<User> {
    this.validateObjectId(id);

    const existingUser = await this.userModel
      .findByIdAndUpdate(
        id,
        updatedUser,
        { returnDocument: 'after'},
      )
      .exec();

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return existingUser;
  }

  async delete(id: string): Promise<User> {
    this.validateObjectId(id);

    const removedUser = await this.userModel.findByIdAndDelete(id).exec();

    if (!removedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return removedUser;
  }

  private validateObjectId(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid MongoDB ObjectId: ${id}`);
    }
  }
}
