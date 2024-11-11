import { endpointToString } from '@grpc/grpc-js/build/src/subchannel-address';
import { Injectable, UseFilters } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ConfilictException, NotFoundException } from '@servel/common';
import { MongoExceptionFilter } from 'src/filters/mongodb.filter';
import {
  AuthType,
  CreateUserDto,
  IUserRepository,
  UpdateUserDetailsDto,
  User,
} from 'src/interfaces/IUser.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: IUserRepository) {}

  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findUserById(id);
    if (!user || !user?.id) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOne(data: { id: string } | { email: string }): Promise<User> {
    //@ts-ignore
    console.log({ id: data.id, email: data.email });
    let user: User | undefined;
    if ('id' in data && data.id) {
      user = await this.userRepository.findUserById(data.id);
    } else if ('email' in data && data.email) {
      user = await this.userRepository.findUserByEmail(data.email);
    }
    if (!user || !user?.id) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user || !user.id) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findUserByGithubId(githubId: string): Promise<User | null> {
    return this.userRepository.findUserByGithubId(githubId);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User | null> {
    const existingUser = await this.userRepository.findUserByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      console.log({ existingUser });
      throw new ConfilictException('User already exist');
    }
    const user = await this.userRepository.createUser(createUserDto);
    return user;
  }

  async updateUserDetails(
    userUpdates: UpdateUserDetailsDto,
  ): Promise<User | null> {
    let user: User | undefined;
    if ('id' in userUpdates && userUpdates.id) {
      return this.userRepository.updateUserDetails({
        id: userUpdates.id,
        updates: userUpdates.updates,
      });
    } else if ('email' in userUpdates && userUpdates.email) {
      return this.userRepository.updateUserDetails({
        email: userUpdates.email,
        updates: userUpdates.updates,
      });
    }
    if (!user || !user?.id) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updatePassword({
    id,
    email,
    password,
  }: {
    id?: string | undefined;
    email?: string | undefined;
    password: string;
  }): Promise<User | null> {
    return this.userRepository.updatePassword({ id, email, password });
  }

  async blockUser(
    user: { email: string } | { id: string },
  ): Promise<User | null> {
    return this.userRepository.updateUserDetails({
      ...user,
      updates: { isBlocked: true },
    });
  }
  async unBlockUser(
    user: { email: string } | { id: string },
  ): Promise<User | null> {
    return this.userRepository.updateUserDetails({
      ...user,
      updates: { isBlocked: false },
    });
  }

  async addAuthType(email: string, authType: AuthType): Promise<void> {
    await this.userRepository.addAuthType(email, authType);
  }
}
