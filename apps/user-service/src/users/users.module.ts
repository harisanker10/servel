import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { KafkaModule } from 'src/kafka/kafka.module';
import { User, UserSchema } from 'src/db/users.schema';
import { UserRepository } from 'src/db/users.repository';
import { IUserRepository } from 'src/interfaces/IUser.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    // KafkaModule,
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
    UsersService,
  ],
})
export class UsersModule {}
