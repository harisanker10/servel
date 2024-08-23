import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Image, ImageDoc } from './image.schema';
import { Model } from 'mongoose';

@Injectable()
export class ImageRepository {
  constructor(@InjectModel(Image.name) private imageModel: Model<ImageDoc>) {}

  async createImage(image: string): Promise<ImageDoc> {
    return new this.imageModel({ image }).save().then((doc) => doc.toObject());
  }
}
