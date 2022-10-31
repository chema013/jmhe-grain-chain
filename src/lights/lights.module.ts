import { Module } from '@nestjs/common';
import { LightsService } from './lights.service';
import { LightsController } from './lights.controller';

@Module({
  controllers: [LightsController],
  providers: [LightsService]
})
export class LightsModule {}
