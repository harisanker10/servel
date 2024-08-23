import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { mongo } from 'mongoose';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class UserControllerErrorHandler implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        // Log the error or perform any other logic
        console.error('Error caught in interceptor:', error);

        // Transform the error if needed
        if (error instanceof mongo.MongoError) {
          if (error?.code === 11000) {
            return throwError(
              () =>
                new RpcException({ code: 6, details: 'User already exist' }),
            );
          }
          return throwError(() => new RpcException('Something went wrong'));
        }

        // Re-throw the error for unhandled cases
        return throwError(() => error);
      }),
    );
  }
}
