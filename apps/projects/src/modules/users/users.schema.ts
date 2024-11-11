import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  collection: 'users',
  versionKey: false,
  timestamps: true,
})
export class User {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ unique: true, sparse: true })
  githubId: string;

  @Prop()
  githubAccessToken: string;

  @Prop({ default: false })
  isBlocked: boolean;

  @Prop({ default: false })
  isProMember: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDoc = HydratedDocument<User> & {
  createdAt: number;
  updatedAt: number;
};
