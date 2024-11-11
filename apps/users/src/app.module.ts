import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ENV } from './config/env';

@Module({
  imports: [UsersModule, MongooseModule.forRoot(ENV.DB_URL)],
  controllers: [],
  providers: [],
})
export class AppModule {}
