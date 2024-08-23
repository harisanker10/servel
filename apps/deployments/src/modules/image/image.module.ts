import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppModule } from 'src/app.module';
import { ImageSchema } from './image.schema';
import { ImageController } from './image.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
    forwardRef(() => AppModule),
  ],
  controllers: [ImageController],
  providers: [],
})
export class DeploymentsModule {}
