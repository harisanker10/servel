import { InjectModel } from '@nestjs/mongoose';
import { User as UserSchema, UserDoc } from './users.schema';
import { Model } from 'mongoose';
import {
  CreateUserWithCredentialsDto,
  CreateUserWithGithubDto,
  CreateUserWithGoogleDto,
  User,
} from '@servel/proto/users';
import { Logger } from '@nestjs/common';

export class UserRepository {
  private logger: Logger;
  constructor(@InjectModel(UserSchema.name) private userModel: Model<UserDoc>) {
    this.logger = new Logger(UserRepository.name);
  }

  findUserById(id: string): Promise<User> {
    return this.userModel.findById(id);
  }

  findUserByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }

  findUserByGithubId(githubId: string): Promise<User> {
    return this.userModel.findOne({ githubId });
  }

  createUserWithGithub(user: CreateUserWithGithubDto): Promise<User> {
    return new this.userModel({
      ...user,
      authType: ['github'],
    })
      .save()
      .then((doc) => doc.toObject());
  }

  createUserWithGoogle(user: CreateUserWithGoogleDto): Promise<User> {
    return new this.userModel({
      ...user,
      authType: ['google'],
    })
      .save()
      .then((doc) => doc.toObject());
  }

  createUserWithCredentials(user: CreateUserWithCredentialsDto): Promise<User> {
    return new this.userModel({
      ...user,
      authType: ['credentials'],
    })
      .save()
      .then((doc) => doc.toObject());
  }

  updateUser(userId: string, updates: Record<string, string>) {
    return this.userModel.updateOne({ _id: userId }, updates);
  }

  async updatePassword(email: string, password: string) {
    await this.userModel.updateOne({ email }, { password });
    return this.userModel.findOne({ email });
  }

  createUser(
    user:
      | CreateUserWithGoogleDto
      | CreateUserWithCredentialsDto
      | CreateUserWithGithubDto,
  ): Promise<User> {
    return new this.userModel({ ...user }).save() as Promise<User>;
  }
}
