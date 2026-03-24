import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRepository } from '../../infrastracture/repositories/user.repository';
import { User as UserEntity } from '../../domain/persistence/entities/user.entity';
import { User as UserSchema, UserDocument } from '../../domain/persistence/schema/user-schema';
import { UserRole } from '../../domain/persistence/enums/user-role.enum';

@Injectable()
export class UserMongooseRepository implements UserRepository {
    constructor(
        @InjectModel(UserSchema.name)
        private readonly userModel: Model<UserDocument>,
    ) {}

    private toEntity(doc: UserDocument): UserEntity {
        return new UserEntity(
            doc._id.toString(),
            doc.name,
            doc.email,
            doc.role,
        );
    }

    // Create User
    async create(user: UserEntity): Promise<UserEntity> {
        const createdUser = new this.userModel({
            name: user.name,
            email: user.email,
            role: user.role,
        });
        const doc = await createdUser.save();
        return this.toEntity(doc);
    }

    //Get All User (filter with role optional)
    async findAll(role?: UserRole): Promise<UserEntity[]> {
        const query = role ? { role } : {};
        const docs = await this.userModel.find(query).exec();
        return docs.map((doc) => this.toEntity(doc));
    }

    //Get User by ID
    async findById(id: string): Promise<UserEntity | null> {
        const doc = await this.userModel.findById(id).exec();
        return doc ? this.toEntity(doc) : null;
    }

    // Patch User by ID
    async patch(id: string, user: Partial<UserEntity>): Promise<UserEntity | null> {
        const updateData: any = {};
        if (user.name) updateData.name = user.name;
        if (user.email) updateData.email = user.email;
        if (user.role) updateData.role = user.role;

        const doc = await this.userModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .exec();
        return doc ? this.toEntity(doc) : null;
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
            new: true,          
            overwrite: true,  
            runValidators: true
        })
        .exec();

    return doc ? this.toEntity(doc) : null;
}


    //Delete User by ID
    async delete(id: string): Promise<void> {
        await this.userModel.findByIdAndDelete(id).exec();
    }

    //Find User by Email
    async findByEmail(email: string): Promise<UserEntity | null> {
        const doc = await this.userModel.findOne({ email }).exec();
        return doc ? this.toEntity(doc) : null;
    }
}
