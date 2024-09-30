import { Module, forwardRef } from '@nestjs/common';
import { BuildService } from './build.service';
import { BuildController } from './build.controller';
import { AppModule } from 'src/app.module';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
  imports: [forwardRef(() => AppModule), KafkaModule],
  controllers: [BuildController],
  providers: [BuildService],
})
export class BuildModule {}
