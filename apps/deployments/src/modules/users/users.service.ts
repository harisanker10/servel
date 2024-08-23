import { Injectable } from '@nestjs/common';
import { User } from './users.schema';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  getUserById(id: string) {}

  addUser(user: User) {
    console.log('adding user:', user);
    return this.userRepository.createUser(user);
  }
}
