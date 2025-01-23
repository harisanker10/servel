import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { User } from '@servel/common/types';

@Injectable()
export class KafkaService {
  private USER_CREATED;
  constructor(
    @Inject('user_service') private readonly kafkaClient: ClientKafka,
  ) {
    this.USER_CREATED = 'user_created';
  }

  emitUserCreatedEvent(user: Omit<User, 'password'>) {
    this.kafkaClient.emit(this.USER_CREATED, user);
  }
}
