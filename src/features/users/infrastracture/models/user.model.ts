import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from '../../domain/enums/user-role.enum';
import { USER_COLLECTION } from '../../domain/constants/user.constants';

export type UserDocument = HydratedDocument<UserModel>;

@Schema({ collection: USER_COLLECTION, timestamps: true })
export class UserModel {
  @Prop({ required: true, index: true })
  name: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true, enum: UserRole, index: true })
  role: UserRole;

  @Prop({ required: true })
  status: boolean;

  @Prop({ default: false, index: true })
  isDeleted: boolean;

  @Prop()
  deletedAt: Date;
  
  @Prop()
  createdAt: Date;
  
  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
