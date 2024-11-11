import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  HttpException,
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

        if (error?.code === 6) {
          return throwError(() => new ConflictException('User already exist'));
        }
        if (error?.code === 5) {
          return throwError(() => new NotFoundException('User does not exist'));
        }
        if (error.message === 'Wrong credentials') {
          return throwError(() => new BadRequestException(error.message));
        }

        if (error instanceof HttpException) {
          return throwError(() => error);
        }

        // Re-throw the error for unhandled cases
        return throwError(
          () => new InternalServerErrorException('Something went wrong'),
        );
      }),
    );
  }
}
