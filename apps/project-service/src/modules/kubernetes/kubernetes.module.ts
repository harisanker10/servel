import { forwardRef, Module } from '@nestjs/common';
import { ProjectsModule } from '../projects/projects.module';
import { KubernetesController } from './kubernetes.controller';
import { KubernetesService } from './kubernetes.service';

@Module({
  imports: [forwardRef(() => ProjectsModule)],
  controllers: [KubernetesController],
  providers: [KubernetesService],
  exports: [KubernetesService],
})
export class KubernetesModule {}
