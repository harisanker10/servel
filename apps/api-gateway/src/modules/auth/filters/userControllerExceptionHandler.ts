import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class UserControllerErrorHandlingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        console.log({ keys: Object.keys(error), vals: Object.values(error) });
        // Handle the error
        console.error('Error caught in interceptor:', error);

        // You can transform the error based on your needs
        if (error?.code === 6) {
          return throwError(() => new ConflictException('User already exist'));
        }
        if (error?.code === 5) {
          return throwError(() => new NotFoundException('User does not exist'));
        }

        // Re-throw the error for unhandled cases
        return throwError(() => error);
      }),
    );
  }
}
