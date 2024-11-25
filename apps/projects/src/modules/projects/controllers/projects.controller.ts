import {
  Controller,
  NotImplementedException,
  UseInterceptors,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
  CreateDeploymentDto,
  CreateProjectDto,
  Deployment,
  Deployments,
  GetDeploymentDto,
  GetDeploymentsDto,
  GetProjectDto,
  GetUserDto,
  PopulatedProject,
  Project,
  ProjectType,
  Projects,
  ProjectsServiceController,
  ProjectsServiceControllerMethods,
  UpdateInstanceTypeDto,
} from '@servel/proto/projects';
import { ProjectsService } from '../services/projects.service';
import { Observable } from 'rxjs';
import { KafkaService } from 'src/modules/kafka/kafka.service';
import {
  DeploymentStatus,
  ImageData,
  InstanceType,
  ProjectStatus,
  StaticSiteData,
  WebServiceData,
} from '@servel/common';
import { KubernetesService } from '../services/kubernetes.service';
import { DomainErrorInterceptor } from 'src/interceptors/domainError.interceptor';
import {
  Image,
  WebService,
} from 'src/repository/interfaces/IProjects.repository';

@Controller()
@UseInterceptors(DomainErrorInterceptor)
@ProjectsServiceControllerMethods()
export class ProjectsController implements ProjectsServiceController {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly projectsService: ProjectsService,
    private readonly kubernetesService: KubernetesService,
  ) {}

  startDeployment(request: GetDeploymentDto): Promise<Deployment> {
    throw new RpcException('not implemented');
  }

  async createProject(dto: CreateProjectDto): Promise<PopulatedProject> {
    const project = await this.projectsService.createProject(dto);

    this.kafkaService.emitToBuildQueue({
      projectId: project.id,
      deploymentType: project.projectType,
      name: project.name,
      data: project.deployments[0].data,
      deploymentId: project.deployments[0].id,
    });

    const deployments: Deployment[] = project.deployments.map((depl) => {
      const { data, ...rest } = depl;
      if (project.projectType === ProjectType.WEB_SERVICE) {
        return { webServiceData: data, ...rest } as Deployment;
      } else if (project.projectType === ProjectType.STATIC_SITE) {
        return { staticSiteData: data, ...rest } as Deployment;
      } else if (project.projectType === ProjectType.IMAGE) {
        return { imageData: data, ...rest } as Deployment;
      }
      throw new Error('Invalide project type');
    });

    return {
      deploymentUrl: '',
      deployments,
      ...project,
    };
  }

  async createDeployment(dto: CreateDeploymentDto): Promise<Deployment> {
    const { projectId, env: envId } = dto;
    const data = dto.imageData || dto.staticSiteData || dto.webServiceData;
    const { imageData, staticSiteData, webServiceData } = dto;

    await this.projectsService.updateDeploymentsWithProjectId({
      projectId,
      updateAll: { status: DeploymentStatus.stopped },
    });

    const project = await this.projectsService.updateProject(projectId, {
      deploymentUrl: '',
      status: ProjectStatus.QUEUED,
    });

    const deployment = await this.projectsService.createDeploymentForProject({
      envId,
      projectId,
      data,
    });

    console.log({ deployment, data: deployment.data });
    this.kafkaService.emitToBuildQueue({
      projectId,
      data: deployment.data,
      name: project.name,
      deploymentId: deployment.id,
      deploymentType: project.projectType,
    });
    return {
      imageData,
      staticSiteData,
      webServiceData,
      ...deployment,
    };
  }

  async getProject(request: GetProjectDto): Promise<PopulatedProject> {
    const project = await this.projectsService.getProject(request.projectId);
    const deployments: Deployment[] = project.deployments.map((depl) => {
      const { data, ...rest } = depl;
      if (project.projectType === ProjectType.WEB_SERVICE) {
        return { webServiceData: data, ...rest } as Deployment;
      } else if (project.projectType === ProjectType.STATIC_SITE) {
        return { staticSiteData: data, ...rest } as Deployment;
      } else if (project.projectType === ProjectType.IMAGE) {
        return { imageData: data, ...rest } as Deployment;
      }
      throw new Error('Invalide project type');
    });
    return {
      ...project,
      projectType: project.projectType,
      deploymentUrl: project.deploymentUrl,
      deployments,
    };
  }

  async getAllProjects(request: GetUserDto): Promise<Projects> {
    const projects = await this.projectsService.getAllProjectsOfUser(
      request.userId,
    );
    if (projects.length < 1) {
      throw new RpcException('No projects');
    }
    if (projects.length > 0) {
      return {
        //@ts-ignore
        projects: projects as Project[],
      };
    }
  }

  async getDeployments(request: GetDeploymentsDto): Promise<Deployments> {
    const project = await this.projectsService.getProject(request.projectId);
    // const deployments = await this.projectsService.getAllDeployments(
    //   request.projectId,
    // );
    if (project.projectType === ProjectType.WEB_SERVICE) {
      return {
        deployments: project.deployments.map((depl) => ({
          ...depl,
          webServiceData: depl.data as WebServiceData,
        })),
      };
    }

    if (project.projectType === ProjectType.STATIC_SITE) {
      return {
        deployments: project.deployments.map((depl) => ({
          ...depl,
          staticSiteData: depl.data as StaticSiteData,
        })),
      };
    }

    if (project.projectType === ProjectType.IMAGE) {
      return {
        deployments: project.deployments.map((depl) => ({
          ...depl,
          imageData: depl.data as ImageData,
        })),
      };
    }

    throw new RpcException({ code: 2 });
  }

  async getDeployment(request: GetDeploymentDto): Promise<Deployment> {
    const depl = await this.projectsService.getDeployment(request.deploymentId);
    if (!depl) {
      throw new RpcException({
        code: 2,
      });
    }

    if ('port' in depl.data && 'runCommand' in depl.data) {
      return {
        ...depl,
        env: depl.env ? depl.env : null,
        webServiceData: depl.data,
      };
    } else if ('outDir' in depl.data) {
      return {
        ...depl,
        env: depl.env ? depl.env : null,
        staticSiteData: depl.data,
      };
    } else if ('imageUrl' in depl.data) {
      return { ...depl, env: depl.env ? depl.env : null, imageData: depl.data };
    }
  }

  async stopDeployment(data: GetDeploymentDto): Promise<Deployment> {
    const deployment = await this.projectsService.getDeployment(
      data.deploymentId,
    );

    const project = await this.projectsService.getProject(deployment.projectId);
    if (project.projectType === ProjectType.WEB_SERVICE) {
      const { clusterServiceName, clusterDeploymentName } =
        deployment.data as WebService;
      console.log({ data: deployment.data });
      const k8data = await Promise.all([
        this.kubernetesService.deleteDeployment(
          'default',
          clusterDeploymentName,
        ),
        this.kubernetesService.deleteClusterIPService(
          'default',
          clusterServiceName,
        ),
      ]);
    }
    await this.projectsService.updateDeployment(deployment.id, {
      status: DeploymentStatus.stopped,
    });

    await this.projectsService.updateProject(deployment.projectId, {
      status: ProjectStatus.STOPPED,
      deploymentUrl: '',
    });
    this.kafkaService.emitDeploymentUpdates({
      updates: { status: ProjectStatus.STOPPED, deploymentUrl: '' },
      deploymentId: deployment.id,
    });
    return this.projectsService.getDeployment(data.deploymentId);
  }

  async retryDeployment(request: GetDeploymentDto): Promise<Deployment> {
    const deployment = await this.projectsService.getDeployment(
      request.deploymentId,
    );

    const project = await this.projectsService.getProject(deployment.projectId);

    await this.projectsService.updateDeploymentsWithProjectId({
      projectId: deployment.projectId,
      updateAll: { status: DeploymentStatus.stopped },
    });

    this.kafkaService.emitToBuildQueue({
      deploymentId: deployment.id,
      data: deployment.data,
      projectId: deployment.projectId,
      name: project.name,
      deploymentType: project.projectType,
    });
    return deployment;
  }

  async stopProject(dto: GetProjectDto): Promise<Project> {
    const deployments = await this.projectsService.getDeploymentsOfProject(
      dto.projectId,
    );

    for (const depl of deployments) {
      if (depl.status === DeploymentStatus.active) {
        await this.stopDeployment({ deploymentId: depl.id });
        return {
          ...(await this.getProject({ projectId: depl.projectId })),
          instanceType: InstanceType.TIER_0,
        };
      }
    }

    throw new RpcException('No active deployment');
  }

  async startProject(dto: GetProjectDto): Promise<Project> {
    throw new RpcException('Not Implemented');
  }

  rollbackProject(
    request: GetDeploymentDto,
  ): Deployment | Promise<Deployment> | Observable<Deployment> {
    throw new NotImplementedException();
  }
  deleteDeployment(
    request: GetDeploymentDto,
  ): Deployment | Promise<Deployment> | Observable<Deployment> {
    throw new NotImplementedException();
  }
  updateInstanceType(
    request: UpdateInstanceTypeDto,
  ): Project | Promise<Project> | Observable<Project> {
    throw new NotImplementedException();
  }

  async deleteProject(request: GetProjectDto): Promise<Project> {
    throw new RpcException('Not implemented');
  }
}
