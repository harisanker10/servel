import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { MongooseError, mongo } from 'mongoose';
import { Observable, catchError, throwError } from 'rxjs';
import * as grpc from '@grpc/grpc-js';
import {
  ConfilictException,
  CustomError,
  NotFoundException,
} from '@servel/common';

@Injectable()
export class UserControllerErrorHandler implements NestInterceptor {
  private logger: Logger;
  constructor() {
    this.logger = new Logger();
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        this.logger.error(error);
        if (
          error instanceof mongo.MongoError ||
          error instanceof MongooseError
        ) {
          switch (error.name) {
            case 'CastError':
              this.logger.log('Throwing error', error.name);
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
            this.logger.log('Throwing error', error.name);
            return throwError(
              () =>
                new RpcException({
                  details: error.name,
                  code: grpc.status.NOT_FOUND,
                }),
            );
          } else if (error instanceof ConfilictException) {
            this.logger.log('Throwing error', error.name);
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
