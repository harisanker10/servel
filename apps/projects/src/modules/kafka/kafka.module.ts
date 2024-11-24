import { Module, forwardRef } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import 'dotenv/config';
import { AppModule } from 'src/app.module';

@Module({
  imports: [forwardRef(() => AppModule)],
  controllers: [],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
