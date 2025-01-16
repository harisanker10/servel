import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, catchError, throwError } from 'rxjs';
import * as grpc from '@grpc/grpc-js';
import {
  CustomError,
  NotFoundException,
  ConfilictException,
} from '@servel/common';

@Injectable()
export class DomainErrorInterceptor implements NestInterceptor {
  private logger: Logger;
  constructor() {
    this.logger = new Logger(DomainErrorInterceptor.name);
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        this.logger.log(error);
        if (error instanceof CustomError) {
          // if (
          //   error instanceof mongo.MongoError ||
          //   error instanceof MongooseError
          // ) {
          //   switch (error.name) {
          //     case 'CastError':
          //       return throwError(
          //         () =>
          //           new RpcException({
          //             details: 'Invalid values',
          //             code: grpc.status.INVALID_ARGUMENT,
          //           }),
          //       );
          //   }

          let code: grpc.status = 2;
          if (error instanceof NotFoundException) {
            code = grpc.status.NOT_FOUND;
          } else if (error instanceof ConfilictException) {
            code = grpc.status.ALREADY_EXISTS;
          }
          this.logger.log('Throwing RPC exception..', {
            details: error.name,
            code,
          });
          return throwError(
            () =>
              new RpcException({
                details: error.name,
                code,
              }),
          );
        }
        this.logger.log('Not DomainError. Throwing...');
        return throwError(() => error);
      }),
    );
  }
}
