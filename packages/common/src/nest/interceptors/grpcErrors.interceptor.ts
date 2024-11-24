// import {
//   Injectable,
//   NestInterceptor,
//   ExecutionContext,
//   CallHandler,
//   Inject,
//   Logger,
// } from "@nestjs/common";
// import { RpcException } from "@nestjs/microservices";
// import { Observable, catchError, throwError } from "rxjs";
// import * as grpc from "@grpc/grpc-js";
// import { CustomError, NotFoundException, ConfilictException } from "src/errors";
//
// @Injectable()
// export class DomainErrorInterceptor implements NestInterceptor {
//   private logger: Logger;
//   constructor(
//     @Inject("INTERCEPTOR_TYPE") private readonly type: "HTTP" | "GRPC",
//   ) {
//     this.logger = new Logger(DomainErrorInterceptor.name);
//   }
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     return next.handle().pipe(
//       catchError((error) => {
//         this.logger.log(error);
//         if (error instanceof CustomError) {
//           // if (
//           //   error instanceof mongo.MongoError ||
//           //   error instanceof MongooseError
//           // ) {
//           //   switch (error.name) {
//           //     case 'CastError':
//           //       return throwError(
//           //         () =>
//           //           new RpcException({
//           //             details: 'Invalid values',
//           //             code: grpc.status.INVALID_ARGUMENT,
//           //           }),
//           //       );
//           //   }
//
//           if (this.type === "HTTP") {
//           } else if (this.type === "GRPC") {
//             let code: grpc.status = 2;
//             if (error instanceof NotFoundException) {
//               code = grpc.status.NOT_FOUND;
//             } else if (error instanceof ConfilictException) {
//               code = grpc.status.ALREADY_EXISTS;
//             }
//             this.logger.log("Throwing RPC exception..", {
//               details: error.name,
//               code,
//             });
//             return throwError(
//               () =>
//                 new RpcException({
//                   details: error.name,
//                   code,
//                 }),
//             );
//           }
//         }
//         this.logger.log("Not DomainError. Throwing...");
//         return throwError(() => error);
//       }),
//     );
//   }
// }
//
//

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { MongooseError, mongo } from "mongoose";
import { Observable, catchError, throwError } from "rxjs";
import * as grpc from "@grpc/grpc-js";
import { ConfilictException, CustomError, NotFoundException } from "src/errors";

@Injectable()
export class GRPCErrorHandlerInterceptor implements NestInterceptor {
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
            case "CastError":
              this.logger.log("Throwing error", error.name);
              return throwError(
                () =>
                  new RpcException({
                    details: "Invalid values",
                    code: grpc.status.INVALID_ARGUMENT,
                  }),
              );
          }
        } else if (error instanceof CustomError) {
          if (error instanceof NotFoundException) {
            this.logger.log("Throwing error", error.name);
            return throwError(
              () =>
                new RpcException({
                  details: error.name,
                  code: grpc.status.NOT_FOUND,
                }),
            );
          } else if (error instanceof ConfilictException) {
            this.logger.log("Throwing error", error.name);
            return throwError(
              () =>
                new RpcException({
                  details: error.name,
                  code: grpc.status.ALREADY_EXISTS,
                }),
            );
          }
        }
        return throwError(() => new RpcException("Something went wrong"));
      }),
    );
  }
}
