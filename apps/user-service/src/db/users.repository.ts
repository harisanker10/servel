import { InjectModel } from '@nestjs/mongoose';
import { User as UserSchema, UserDoc } from './users.schema';
import { Model } from 'mongoose';
import {
  IUserRepository,
  User,
  UpdateUserDetailsDto,
  AuthType,
  CreateUserDto,
} from 'src/interfaces/IUser.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(UserSchema.name) private userModel: Model<UserDoc>,
  ) {}

  findUserById(id: string): Promise<User | null> {
    return this.userModel
      .findById(id)
      .then((doc) => doc?._id && doc.toObject<User>());
  }
  findUserByEmail(email: string): Promise<User | null> {
    return this.userModel
      .findOne({ email })
      .then((doc) => doc?._id && doc.toObject<User>());
  }
  findUserByGithubId(githubId: string): Promise<User | null> {
    return this.userModel
      .findOne({ githubId })
      .then((doc) => doc?._id && doc.toObject<User>());
  }
  createUser(createUserDto: CreateUserDto): Promise<User | null> {
    console.log({ createUserDto });
    return new this.userModel({
      ...createUserDto,
      authType: [createUserDto.authType],
      accessTokens: [createUserDto.accessToken],
    })
      .save()
      .then((doc) => doc?._id && doc.toObject<User>());
  }
  async updateUserDetails(
    userUpdates: UpdateUserDetailsDto,
  ): Promise<User | null> {
    const filter: Record<string, any> = {};
    if ('id' in userUpdates && userUpdates.id) {
      filter._id = userUpdates.id;
    } else if ('email' in userUpdates && userUpdates.email) {
      filter.email = userUpdates.email;
    }
    return this.userModel
      .findOneAndUpdate(filter, userUpdates.updates, {
        new: true,
      })
      .then((doc) => doc?._id && doc.toObject<User>());
  }
  updatePassword({
    id,
    email,
    password,
  }: {
    id: string;
    email: string;
    password: string;
  }): Promise<User | null> {
    const filter: Record<string, any> = {};
    if (id) {
      filter._id = id;
    } else if (email) {
      filter.email = email;
    }
    return this.userModel
      .findOneAndUpdate(
        { email },
        { password, $addToSet: { authType: AuthType.CREDENTIALS } },
        { new: true },
      )
      .then((doc) => doc?._id && doc.toObject<User>());
  }
  addAuthType(email: string, authType: AuthType): Promise<User> {
    return this.userModel
      .findOneAndUpdate(
        { email },
        { $addToSet: { authType: authType } },
        { new: true },
      )
      .then((doc) => doc?._id && doc.toObject<User>());
  }

  async getAccessTokens({
    email,
    id,
  }: {
    email?: string;
    id?: string;
  }): Promise<
    { accessToken: string; refreshToken?: string; provider: string }[]
  > {
    console.log('getting access token', { email, id });
    const queryFilter = {};
    if (email) queryFilter['email'] = email;
    else if (id) queryFilter['_id'] = id;

    const data = await this.userModel.findOne(queryFilter, {
      accessTokens: 1,
    });
    console.log({ accesstokends: data });
    return data?.accessTokens;
  }
}
