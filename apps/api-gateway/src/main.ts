import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import { ZodFilter } from './filters/zodExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: true },
    }),
  );
  app.useGlobalFilters(new ZodFilter());
  const cors = {
    origin: ['http://localhost:3000', '*'],
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    allowedHeaders: ['Accept', 'Content-Type', 'Authorization'],
  };
  app.enableCors(cors);

  await app.listen(3001);
}
bootstrap();
