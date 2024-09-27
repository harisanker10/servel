import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RequestModule } from './request.module';
import { MongooseModule } from '@nestjs/mongoose';
import 'dotenv/config';

console.log({ elonma: process.env.DB_URL });
@Module({
  imports: [
    ConfigModule.forRoot(),
    RequestModule,
    MongooseModule.forRoot(process.env.DB_URL),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
