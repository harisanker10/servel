import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@servel/common';
import { DeploymentStatus, ProjectStatus } from '@servel/common/types';
import { DeploymentRepository } from 'src/repository/deployment.repository';
import { Deployment } from 'src/types';
import { CreateProjectDto } from 'src/repository/interfaces/IProjects.repository';
import { ProjectRepository } from 'src/repository/project.repository';
import { PopulatedProject, Project } from 'src/types';
import { KafkaService } from './kafka.service';
import { KubernetesService } from './kubernetes.service';

/*
 * This service holds all builsness logic.
 * Mostly, methods in this service does 3 things:
 *  - mutate database
 *  - emits messages to broker for other services like build-service or reuquest-service
 *  - methods like stopProject directly calls cluster service (kubernetes)
 */

@Injectable()
export class ProjectsService {
  constructor(
    private readonly projectRepositroy: ProjectRepository,
    private readonly deploymentRepository: DeploymentRepository,
    private readonly kafkaService: KafkaService,
    private readonly kubernetesService: KubernetesService,
    // private readonly envService: EnvService,
  ) {}

  async createProject(data: CreateProjectDto): Promise<PopulatedProject> {
    // database mutation
    const project = await this.projectRepositroy.createProject({
      ...data,
    });
    const deployment = await this.deploymentRepository.createDeployment({
      ...data,
      projectId: project.id,
    });

    //messaging broker
    this.kafkaService.emitToBuildAndDeployQueue({
      instanceType: project.instanceType,
      deploymentId: deployment.id,
      name: project.name,
      projectId: project.id,
      envs: deployment.envs,
      imageServiceData: deployment.imageData,
      staticSiteServiceData: {
        ...deployment.staticSiteData,
        assetsPushUrl: '',
        buildLogsPushUrl: '',
      },
      webServiceData: { ...deployment.webServiceData, buildLogsPushUrl: '' },
      projectType: project.projectType,
    });
    return { ...project, deployments: [deployment] };
  }

  async stopProject(
    projectId: string,
  ): Promise<{ project: Project; deployment: Deployment }> {
    // database mutation
    const activeDeployment =
      await this.deploymentRepository.findActiveDeploymentOfProject(projectId);
    if (!activeDeployment) {
      return;
    }
    const [deployment, project] = await Promise.all([
      this.deploymentRepository.updateDeploymentStatus(
        activeDeployment.id,
        DeploymentStatus.STOPPED,
      ),
      this.projectRepositroy.updateProjectStatus(
        projectId,
        ProjectStatus.STOPPED,
      ),
    ]);

    // messaging broker
    this.kafkaService.emitDeploymentStoppedEvent({
      projectId: project.id,
      deploymentId: deployment.id,
      projectType: project.projectType,
    });

    // update cluster
    this.kubernetesService.stopDeployment(activeDeployment.id);

    return { deployment, project };
  }

  // async rollbackProject(deploymentId: string): Promise<Deployment> {
  //   const _deployment =
  //     await this.deploymentRepository.findDeploymentById(deploymentId);
  //   const activeDeployment =
  //     await this.deploymentRepository.findActiveDeploymentOfProject(
  //       _deployment.projectId,
  //     );
  //   if (activeDeployment?.id) {
  //     await this.stopProject(_deployment.projectId);
  //   }
  //
  //   const startedDeployment =
  //     await this.deploymentService.startDeployment(deploymentId);
  //   return startedDeployment;
  // }

  async updateProject(
    projectId: string,
    updates: Partial<Record<keyof Project, string>>,
  ) {
    return this.projectRepositroy.updateProject({ projectId, updates });
  }

  async getAllProjectsOfUser(userId: string): Promise<Project[]> {
    const projects = await this.projectRepositroy.getProjectsWithUserId(userId);
    if (!projects || projects.length < 1) {
      throw new NotFoundException('Projects not found');
    }
    return projects;
  }

  async updateProjectStatus(projectId: string, status: ProjectStatus) {
    return this.projectRepositroy.updateProjectStatus(projectId, status);
  }

  async getProject(projectId: string): Promise<PopulatedProject> {
    const [project, deployments] = await Promise.all([
      this.projectRepositroy.getProject(projectId),
      this.deploymentRepository.findDeploymentsOfProject(projectId),
    ]);
    if (!project || !project?.id) {
      throw new NotFoundException('Project not found');
    }
    return { ...project, deployments };
  }
}
