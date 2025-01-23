import {
  ArgumentMetadata,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodPipe implements PipeTransform {
  private logger: Logger;
  constructor(private readonly schema: ZodSchema) {
    this.logger = new Logger(ZodPipe.name);
  }

  transform(value: any, metadata: ArgumentMetadata) {
    const parsed = this.schema.safeParse(value);
    this.logger.log('Parsing', value);
    if (!parsed.success) {
      this.logger.error(parsed.error.issues);
    }
    if (metadata.type === 'body') {
      this.schema.parse(value);
    }
    return value;
  }
}
