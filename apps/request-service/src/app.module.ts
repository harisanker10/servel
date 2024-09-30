import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import 'dotenv/config';
import { RequestModule } from './modules/requests/request.module';

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
