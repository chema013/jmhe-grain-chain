import { Module } from '@nestjs/common';
import { LightsModule } from './lights/lights.module';

@Module({
  imports: [LightsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
