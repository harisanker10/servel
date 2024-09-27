import { Module } from '@nestjs/common';
import { BuildModule } from './build/build.module';

@Module({
  imports: [BuildModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
