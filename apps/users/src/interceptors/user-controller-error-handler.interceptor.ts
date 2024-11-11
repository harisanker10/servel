import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotFoundException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { MongooseError, mongo } from 'mongoose';
import { Observable, catchError, throwError } from 'rxjs';
import * as grpc from '@grpc/grpc-js';
import { ConfilictException, CustomError } from '@servel/common';

@Injectable()
export class UserControllerErrorHandler implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        console.log({ error });
        if (
          error instanceof mongo.MongoError ||
          error instanceof MongooseError
        ) {
          switch (error.name) {
            case 'CastError':
              return throwError(
                () =>
                  new RpcException({
                    details: 'Invalid values',
                    code: grpc.status.INVALID_ARGUMENT,
                  }),
              );
          }
        } else if (error instanceof CustomError) {
          if (error instanceof NotFoundException) {
            return throwError(
              () =>
                new RpcException({
                  details: error.name,
                  code: grpc.status.NOT_FOUND,
                }),
            );
          } else if (error instanceof ConfilictException) {
            return throwError(
              () =>
                new RpcException({
                  details: error.name,
                  code: grpc.status.ALREADY_EXISTS,
                }),
            );
          }
        }
        return throwError(() => new RpcException('Something went wrong'));
      }),
    );
  }
}
