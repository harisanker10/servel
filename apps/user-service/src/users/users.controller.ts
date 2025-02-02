import {
  Controller,
  NotImplementedException,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  AccessTokens,
  CreateUserDto,
  FindOneUserDto,
  PaginationDto,
  UpdateUserDto,
  User,
  UserServiceController,
  UserServiceControllerMethods,
  Users,
} from '@servel/proto/users';
import { UsersService } from './users.service';
import { RpcException } from '@nestjs/microservices';
import { UserControllerErrorHandler } from 'src/interceptors/user-controller-error-handler.interceptor';
import { KafkaService } from 'src/kafka/kafka.service';
import { GRPCErrorHandlerInterceptor } from '@servel/common';

@Controller('users')
@UseInterceptors(UserControllerErrorHandler)
@UserServiceControllerMethods()
export class UsersController implements UserServiceController {
  constructor(
    private readonly userService: UsersService,
    // private readonly kafkaService: KafkaService,
  ) {}

  async createUser(data: CreateUserDto): Promise<User> {
    console.log({ data });
    //@ts-ignore
    const user = await this.userService.createUser({ ...data });
    // this.kafkaService.emitUserCreatedEvent(user);
    return user;
  }

  queryUsers(request: Observable<PaginationDto>): Observable<Users> {
    throw new RpcException({ details: 'not implemented', code: 4 });
  }
  removeUser(request: FindOneUserDto): User | Promise<User> | Observable<User> {
    throw new RpcException({ details: 'not implemented', code: 4 });
  }
  async updateUser(body: UpdateUserDto): Promise<User> {
    console.log({ body });
    if (body.updates.password) {
      return this.userService.updatePassword({
        email: body.email,
        id: body.id,
        password: body.updates.password,
      });
    } else {
      return this.userService.updateUserDetails({
        id: body.id,
        email: body.email,
        updates: body.updates,
      });
    }
  }
  async findOneUser(userData: FindOneUserDto): Promise<User> {
    //@ts-ignore
    console.log({ id: userData.id, email: userData.email });
    return this.userService.findOne({ email: userData.email, id: userData.id });
  }
  findAllUsers(): Observable<Users> {
    throw new RpcException({ details: 'not implemented', code: 4 });
  }

  async getAccessTokens(request: FindOneUserDto): Promise<AccessTokens> {
    const accessTokens = await this.userService.getAccessTokens({
      email: request.email,
      id: request.id,
    });
    return { accessToken: accessTokens };
  }
}
