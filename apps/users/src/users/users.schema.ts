import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  collection: 'users',
  versionKey: false,
  timestamps: true,
  id: true,
  toObject: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({})
  password: string;

  @Prop()
  avatar: string;

  @Prop()
  fullname: string;

  @Prop({ unique: true, sparse: true })
  githubId: string;

  @Prop()
  githubAccessToken: string;

  @Prop({ type: [String], enum: ['github', 'google', 'credentials'] })
  authType: string[];

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
