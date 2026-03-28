import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRepository } from '../../infrastracture/repositories/user.repository';
import { User as UserEntity } from '../../domain/entities/user.entity';
import {
  UserDocument,
} from '../../infrastracture/models/user.model';
import { USER_MODEL } from '../../domain/constants/user.constants';
import { UserRole } from '../../domain/enums/user-role.enum';
import { PaginatedResult } from '../../../../common/interfaces/paginated-result.interface';
import { toEntity } from '../../infrastracture/mappers/user-mapper';
@Injectable()
export class UserMongooseRepository implements UserRepository {
  constructor(
    @InjectModel(USER_MODEL)
    private readonly userModel: Model<UserDocument>,
  ) { }

  // Create User
  async create(user: UserEntity): Promise<UserEntity> {
    const createdUser = new this.userModel({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    const doc = await createdUser.save();
    return toEntity(doc);
  }

  //Get All User (filter with role optional)
  async findAll(role?: UserRole): Promise<UserEntity[]> {
    const query = role ? { role } : {};
    const docs = await this.userModel.find(query).exec();
    return docs.map((doc) => toEntity(doc));
  }

  // Get All Users with Pagination (page is 1-indexed)
  async findAllPaginated(page: number, size: number, role?: UserRole): Promise<PaginatedResult<UserEntity>> {
    const query = role ? { role } : {};
    const skip = (page - 1) * size;

    // Run count + paginated fetch in parallel for performance
    const [totalElements, docs] = await Promise.all([
      this.userModel.countDocuments(query).exec(),
      this.userModel.find(query).skip(skip).limit(size).exec(),
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

  //Get User by ID
  async findById(id: string): Promise<UserEntity | null> {
    const doc = await this.userModel.findById(id).exec();
    return doc ? toEntity(doc) : null;
  }

  //Get Users by IDs (batch lookup)
  async findByIds(ids: string[]): Promise<UserEntity[]> {
    const docs = await this.userModel.find({ _id: { $in: ids } }).exec();
    return docs.map((doc) => toEntity(doc));
  }

  // Patch User by ID
  async patch(
    id: string,
    user: Partial<UserEntity>,
  ): Promise<UserEntity | null> {
    const updateData: any = {};
    if (user.name) updateData.name = user.name;
    if (user.email) updateData.email = user.email;
    if (user.role) updateData.role = user.role;

    const doc = await this.userModel
      .findByIdAndUpdate(id, updateData, { returnDocument: 'after' })
      .exec();
    return doc ? toEntity(doc) : null;
  }

  //PUT User by ID
  async put(id: string, user: UserEntity): Promise<UserEntity | null> {
    const updateData = {
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const doc = await this.userModel
      .findByIdAndUpdate(id, updateData, {
        returnDocument: 'after',
        overwrite: true,
        runValidators: true,
      })
      .exec();

    return doc ? toEntity(doc) : null;
  }

  //Delete User by ID
  async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }

  //Find User by Email
  async findByEmail(email: string): Promise<UserEntity | null> {
    const doc = await this.userModel.findOne({ email }).exec();
    return doc ? toEntity(doc) : null;
  }
}
