import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from '../enums/user-role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'Users'})
export class User {

    @Prop({ required: true})
    name: string;

    @Prop({ required: true, unique: true})
    email: string;
    
    @Prop({ required: true, enum: UserRole })
    role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);