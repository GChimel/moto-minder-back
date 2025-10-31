import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MotocycleModelSchema } from './infrastructure/persistence/motocycle-model.schema';
import { TypeOrmMotocycleModelRepository } from './infrastructure/adapters/typeorm-motocycle-model.repository';
import { MOTOCYCLE_MODEL_REPOSITORY } from './application/ports/motocycle-model.repository.port';
import { CreateMotocycleModelUseCase } from './application/use-cases/create-motocycle-model.use-case';
import { UpdateMotocycleModelUseCase } from './application/use-cases/update-motocycle-model.use-case';
import { DeleteMotocycleModelUseCase } from './application/use-cases/delete-motocycle-model.use-case';
import { FindMotocycleModelByIdUseCase } from './application/use-cases/find-motocycle-model-by-id.use-case';
import { FindAllMotocycleModelsUseCase } from './application/use-cases/find-all-motocycle-models.use-case';
import { FindMotocycleModelsByManufacturerUseCase } from './application/use-cases/find-motocycle-models-by-manufacturer.use-case';
import { MotocycleModelsController } from './presentation/motocycle-models.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MotocycleModelSchema])],
  providers: [
    CreateMotocycleModelUseCase,
    UpdateMotocycleModelUseCase,
    DeleteMotocycleModelUseCase,
    FindMotocycleModelByIdUseCase,
    FindAllMotocycleModelsUseCase,
    FindMotocycleModelsByManufacturerUseCase,
    {
      provide: MOTOCYCLE_MODEL_REPOSITORY,
      useClass: TypeOrmMotocycleModelRepository,
    },
  ],
  controllers: [MotocycleModelsController],
  exports: [
    FindMotocycleModelByIdUseCase,
    FindMotocycleModelsByManufacturerUseCase,
  ],
})
export class MotocycleModelsModule {}
