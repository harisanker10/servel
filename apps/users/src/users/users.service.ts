import { Injectable } from '@nestjs/common';
import {
  CreateUserWithCredentialsDto,
  CreateUserWithGithubDto,
  CreateUserWithGoogleDto,
  FindOneUserDto,
  UpdateUserDto,
} from '@servel/proto/users';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  createUserWithGithub(user: CreateUserWithGithubDto) {
    return this.userRepository.createUserWithGithub(user);
  }

  createUserWithGoogle(user: CreateUserWithGoogleDto) {
    return this.userRepository.createUserWithGoogle(user);
  }

  createUser(
    user:
      | CreateUserWithGoogleDto
      | CreateUserWithCredentialsDto
      | CreateUserWithGithubDto,
  ) {
    return this.userRepository.createUser({ ...user });
  }

  createUserWithCredentials(user: CreateUserWithCredentialsDto) {
    return this.userRepository.createUserWithCredentials(user);
  }

  updateUser(user: UpdateUserDto) {
    //@ts-ignore
    return this.userRepository.updateUser(user.id, user.updates);
  }

  async findOne(user: FindOneUserDto) {
    if (user.githubId) {
      return this.userRepository.findUserByGithubId(user.githubId);
    } else if (user.id) {
      return this.userRepository.findUserById(user.id);
    } else {
      return this.userRepository.findUserByEmail(user.email);
    }
  }
}
