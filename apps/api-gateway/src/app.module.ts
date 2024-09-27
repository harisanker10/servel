import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { DeploymentsModule } from './modules/deployments/deployments.module';

@Module({
  imports: [AuthModule, ProjectsModule, DeploymentsModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
