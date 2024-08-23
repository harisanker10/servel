import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { DeploymentsModule } from './modules/deployments/deployments.module';

@Module({
  imports: [AuthModule, DeploymentsModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
