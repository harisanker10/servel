import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDoc } from './users.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDoc>) {}

  createUser(user: User): Promise<User> {
    return new this.userModel(user).save().then((doc) => doc.toObject());
  }

  findUserById(id: string): Promise<User> {
    return this.userModel.findOne({ id }).then((doc) => doc.toObject());
  }
}
