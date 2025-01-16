import { Injectable } from '@nestjs/common';
import { RequestDto } from '@servel/common';
import { AnalyticsRepository } from 'src/repository/analytics.repository';

@Injectable()
export class AnalyticsService {
  constructor(private readonly analyticsrepository: AnalyticsRepository) {}

  createAnalyics(data: RequestDto & { projectId: string }) {
    return this.analyticsrepository.addAnalytics({
      ...data,
      projectId: data.projectId,
    });
  }

  getAnalytics(projectId: string) {
    return this.analyticsrepository.getAnlaytics(projectId);
  }
}
