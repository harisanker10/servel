import { InjectModel } from '@nestjs/mongoose';
import { RequestDto } from '@servel/common';
import { Model } from 'mongoose';
import { Analytics } from 'src/schemas/analytics.schema';

export class AnalyticsRepository {
  constructor(
    @InjectModel(Analytics.name)
    private readonly analyticsModel: Model<Analytics>,
  ) {}

  async addAnalytics(data: RequestDto & { projectId: string }) {
    return new this.analyticsModel({ ...data })
      .save()
      .then((doc) => doc.toObject());
  }

  async getAnlaytics(projectId: string) {
    return this.analyticsModel
      .find({ projectId })
      .then((docs) => docs.length && docs.map((doc) => doc.toObject()));
  }
}
