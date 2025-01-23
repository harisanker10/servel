import { Module, forwardRef } from '@nestjs/common';
import { BuildService } from './build.service';
import { BuildController } from './build.controller';
import { AppModule } from 'src/app.module';
import { KafkaModule } from '../kafka/kafka.module';
import { DeploymentStrategyResolver } from 'src/deploymentStrategy/deployment.strategy.resolver';
import { S3Service } from 'src/services/s3.service';
import { KubernetesService } from 'src/services/kubernetes.service';
import { ManifestService } from 'src/services/manifest.service';

@Module({
  imports: [forwardRef(() => AppModule), KafkaModule],
  controllers: [BuildController],
  providers: [
    ManifestService,
    KubernetesService,
    BuildService,
    S3Service,
    DeploymentStrategyResolver,
  ],
})
export class BuildModule {}
