import { Controller, Inject, UseInterceptors } from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  CreateUserWithCredentialsDto,
  CreateUserWithGithubDto,
  CreateUserWithGoogleDto,
  FindOneUserDto,
  PaginationDto,
  UpdateUserDto,
  User,
  UserServiceController,
  UserServiceControllerMethods,
  Users,
} from '@servel/dto';
import { UsersService } from './users.service';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { UserControllerErrorHandler } from 'src/interceptors/user-controller-error-handler.interceptor';
import { KafkaService } from 'src/kafka/kafka.service';

@Controller('users')
@UseInterceptors(UserControllerErrorHandler)
@UserServiceControllerMethods()
export class UsersController implements UserServiceController {
  constructor(
    private readonly userService: UsersService,
    private readonly kafkaService: KafkaService,
  ) {
    console.log('controller');
  }

  async createUserWithGithub(user: CreateUserWithGithubDto): Promise<User> {
    const savedUser = await this.userService.createUserWithGithub(user);
    this.kafkaService.emitUserCreatedEvent(savedUser);
    return savedUser;
  }

  async createUserWithGoogle(user: CreateUserWithGoogleDto): Promise<User> {
    console.log('creating user with google');
    const newUser = await this.userService.createUserWithGoogle(user);
    console.log({ newUser });
    this.kafkaService.emitUserCreatedEvent(newUser);
    return newUser;
  }

  async createUserWithCredentials(
    user: CreateUserWithCredentialsDto,
  ): Promise<User> {
    console.log('creating user with cred');
    const newUser = await this.userService.createUserWithCredentials(user);
    delete newUser.password;
    this.kafkaService.emitUserCreatedEvent(newUser);
    return newUser;
  }

  queryUsers(request: Observable<PaginationDto>): Observable<Users> {
    return new Observable();
  }
  removeUser(request: FindOneUserDto): User | Promise<User> | Observable<User> {
    return new Observable();
  }
  updateUser(request: UpdateUserDto): User | Promise<User> | Observable<User> {
    return this.userService.updatePassword(request) as Promise<User>;
  }
  async findOneUser(userData: FindOneUserDto): Promise<User> {
    console.log('finding one user');
    const user = await this.userService.findOne(userData);
    console.log({ user });
    if (!user?.email) {
      throw new RpcException({ code: 5, details: "User doesn't exists" });
    }
    return user;
  }
  findAllUsers(): Observable<Users> {
    return new Observable();
  }
}
