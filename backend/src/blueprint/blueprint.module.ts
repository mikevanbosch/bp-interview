import { Module } from '@nestjs/common';
import { BlueprintController } from './controllers/blueprint.controller';
import { BlueprintService } from './services/blueprint.service';
import { BlueprintRepository } from './repositories/blueprint.repository';

@Module({
  imports: [],
  controllers: [BlueprintController],
  providers: [BlueprintService, BlueprintRepository],
})
export class BlueprintModule {}
