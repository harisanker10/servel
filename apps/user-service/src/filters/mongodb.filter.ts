import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { MongooseError, mongo } from 'mongoose';
import { throwError } from 'rxjs';
import * as grpc from '@grpc/grpc-js';

Catch(mongo.MongoError, MongooseError);
export class MongoExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger;
  constructor() {
    this.logger = new Logger(MongoExceptionFilter.name);
  }
  catch(exception: mongo.MongoError, host: ArgumentsHost) {
    this.logger.log('Error caught in monogodb filter');
    this.logger.error({
      name: exception.name,
      message: exception.message,
      code: exception.code,
    });
  }
}
