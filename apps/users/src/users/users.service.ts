import { Injectable } from '@nestjs/common';
import {
  CreateUserWithCredentialsDto,
  CreateUserWithGithubDto,
  CreateUserWithGoogleDto,
  FindOneUserDto,
} from '@servel/dto';
import { UserRepository } from './users.repository';
import { UpdateUserDto } from '@servel/dto';

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

  updatePassword(user: UpdateUserDto) {
    return this.userRepository.updatePassword(user.email, user.password);
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
