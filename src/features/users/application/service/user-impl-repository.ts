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
      status: user.status,
    });
    const doc = await createdUser.save();
    return toEntity(doc);
  }

  //Get All User (filter with role optional)
  async findAll(role?: UserRole, search?: string): Promise<UserEntity[]> {
    const query: any = { isDeleted: false };
    if (role) query.role = role;

    if (search) {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(safeSearch, 'i');
      query.$or = [{ name: regex }, { email: regex }];
    }

    const docs = await this.userModel
      .find(query)
      .select('-__v')
      .lean()
      .exec();
    return docs.map((doc: any) => toEntity(doc));
  }

  // Get All Users with Pagination (page is 1-indexed)
  async findAllPaginated(
    page: number,
    size: number,
    role?: UserRole,
    search?: string,
  ): Promise<PaginatedResult<UserEntity>> {
    const query: any = { isDeleted: false };
    if (role) query.role = role;

    if (search) {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(safeSearch, 'i');
      query.$or = [{ name: regex }, { email: regex }];
    }

    const skip = (page - 1) * size;

    // Run count + paginated fetch in parallel for performance
    const [totalElements, docs] = await Promise.all([
      this.userModel.countDocuments(query).exec(),
      this.userModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(size)
        .select('-__v')
        .lean()
        .exec(),
    ]);

    const content = docs.map((doc: any) => toEntity(doc));
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
    const doc = await this.userModel.findOne({ _id: id, isDeleted: false }).exec();
    return doc ? toEntity(doc) : null;
  }

  //Get Users by IDs (batch lookup)
  async findByIds(ids: string[]): Promise<UserEntity[]> {
    const docs = await this.userModel.find({ _id: { $in: ids }, isDeleted: false }).exec();
    return docs.map((doc) => toEntity(doc));
  }

  // Patch User by ID
  async patch(
    id: string,
    user: Partial<UserEntity>,
  ): Promise<UserEntity | null> {
    const updateData: any = {};
    if (user.name !== undefined) updateData.name = user.name;
    if (user.email !== undefined) updateData.email = user.email;
    if (user.role !== undefined) updateData.role = user.role;
    if (user.status !== undefined) updateData.status = user.status;

    const doc = await this.userModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, updateData, { returnDocument: 'after' })
      .exec();
    return doc ? toEntity(doc) : null;
  }

  //PUT User by ID
  async put(id: string, user: UserEntity): Promise<UserEntity | null> {
    const updateData = {
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    const doc = await this.userModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, updateData, {
        returnDocument: 'after',
        overwrite: true,
        runValidators: true,
      })
      .exec();

    return doc ? toEntity(doc) : null;
  }

  //Delete User by ID
  async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date(),
    }).exec();
  }

  //Restore User by ID
  async restore(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, {
      $set: { isDeleted: false },
      $unset: { deletedAt: 1 },
    }).exec();
  }

  //Hard Delete User by ID
  async hardDelete(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }

  //Find User by Email
  async findByEmail(email: string): Promise<UserEntity | null> {
    const doc = await this.userModel.findOne({ email, isDeleted: false }).exec();
    return doc ? toEntity(doc) : null;
  }
}
