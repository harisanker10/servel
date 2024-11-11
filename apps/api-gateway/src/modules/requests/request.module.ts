import { Module } from '@nestjs/common';
import { RequestController } from './request.controller';

@Module({
  imports: [],
  controllers: [RequestController],
  providers: [],
})
export class RequestModule {}
