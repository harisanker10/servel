import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { DeploymentsModule } from './modules/deployments/deployments.module';
import { UsersModule } from './modules/users/users.module';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { env } from 'process';
import { OtpService } from './utils/otp.service';

const JwtModule = NestJwtModule.register({
  global: true,
  secret: env.JWT_SECRET,
  signOptions: {
    expiresIn: '15d',
  },
});

@Module({
  imports: [
    JwtModule,
    UsersModule,
    AuthModule,
    ProjectsModule,
    DeploymentsModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
