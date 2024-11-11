import {
  BadRequestException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, query } from 'express';

@Injectable()
export class GithubAuthGuard extends AuthGuard('github') {
  getAuthenticateOptions(context: ExecutionContext) {
    const req: Request = this.getRequest(context);
    const intent = req.query['intent'] && req.query['intent'].toString();
    const isCallback = req.path.indexOf('callback') > -1;
    if (!isCallback && !['signup', 'login'].includes(intent || '')) {
      throw new BadRequestException('No intent set');
    }
    return { state: intent };
  }
}
