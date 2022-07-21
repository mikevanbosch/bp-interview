import { Module } from '@nestjs/common';
import { BlueprintModule } from './blueprint/blueprint.module';

@Module({
  imports: [BlueprintModule],
})
export class AppModule {}
