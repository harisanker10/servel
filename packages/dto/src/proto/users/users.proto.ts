import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { User, Users } from "./users";

export interface CreateUserWithGoogleDto {
  email: string;
  avatar: string;
  fullname: string;
}

export interface CreateUserWithGithubDto {
  email: string;
  avatar: string;
  fullname: string;
  githubId: string;
}

export interface CreateUserWithCredentialsDto {
  email: string;
  password: string;
}

export interface QueryUserDto {
  email?: string | undefined;
  githubId?: string | undefined;
  isBlocked?: boolean | undefined;
  isProMember?: boolean | undefined;
  createdAt?: number | undefined;
  sort?: number | undefined;
}

export interface UpdateUserDto {
  email?: string | undefined;
  password?: string | undefined;
  newPassword?: string | undefined;
  avatar?: string | undefined;
  githubId?: string | undefined;
  isBlocked?: boolean | undefined;
  isProMember?: boolean | undefined;
}

export interface FindOneUserDto {
  id?: string | undefined;
  email?: string | undefined;
  githubId?: string | undefined;
}

export interface PaginationDto {
  page: number;
  skip: number;
  query: QueryUserDto | undefined;
}

interface Empty {}

export const USERS_PACKAGE_NAME = "users";

export interface UserServiceClient {
  createUserWithCredentials(
    request: CreateUserWithCredentialsDto,
  ): Observable<User>;

  createUserWithGoogle(request: CreateUserWithGoogleDto): Observable<User>;

  createUserWithGithub(request: CreateUserWithGithubDto): Observable<User>;

  findAllUsers(request: Empty): Observable<Users>;

  findOneUser(request: FindOneUserDto): Observable<User>;

  removeUser(request: FindOneUserDto): Observable<User>;

  queryUsers(request: Observable<PaginationDto>): Observable<Users>;

  updateUser(request: UpdateUserDto): Observable<User>;
}

export interface UserServiceController {
  createUserWithCredentials(
    request: CreateUserWithCredentialsDto,
  ): Promise<User> | Observable<User> | User;

  createUserWithGoogle(
    request: CreateUserWithGoogleDto,
  ): Promise<User> | Observable<User> | User;

  createUserWithGithub(
    request: CreateUserWithGithubDto,
  ): Promise<User> | Observable<User> | User;

  findAllUsers(request: Empty): Observable<Users>;

  findOneUser(request: FindOneUserDto): Promise<User> | Observable<User> | User;

  removeUser(request: FindOneUserDto): Promise<User> | Observable<User> | User;

  queryUsers(request: Observable<PaginationDto>): Observable<Users>;

  updateUser(request: UpdateUserDto): Promise<User> | Observable<User> | User;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "createUserWithCredentials",
      "createUserWithGoogle",
      "createUserWithGithub",
      "findAllUsers",
      "findOneUser",
      "removeUser",
      "updateUser",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod("UserService", method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = ["queryUsers"];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod("UserService", method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const USER_SERVICE_NAME = "UserService";
