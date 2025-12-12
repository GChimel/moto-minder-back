import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartWearSchema } from './infrastructure/persistence/part-wear.schema';
import { TypeOrmPartWearRepository } from './infrastructure/adapters/typeorm-part-wear.repository';
import { CalculatePartWearUseCase } from './application/use-cases/calculate-part-wear.use-case';
import { GetPartWearUseCase } from './application/use-cases/get-part-wear.use-case';
import { GetMotorcyclePartsWearUseCase } from './application/use-cases/get-motorcycle-parts-wear.use-case';
import { GetPartsDueForMaintenanceUseCase } from './application/use-cases/get-parts-due-for-maintenance.use-case';
import { PartWearController } from './presentation/part-wear.controller';
import { PART_WEAR_REPOSITORY } from './application/ports/part-wear.repository.port';
import { MotorcyclePartModule } from '../motorcycle-part/motorcycle-part.module';
import { MotorcyclePartSchema } from '../motorcycle-part/infrastructure/persistence/motorcycle-part.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([PartWearSchema, MotorcyclePartSchema]),
    MotorcyclePartModule,
  ],
  providers: [
    CalculatePartWearUseCase,
    GetPartWearUseCase,
    GetMotorcyclePartsWearUseCase,
    GetPartsDueForMaintenanceUseCase,
    {
      provide: PART_WEAR_REPOSITORY,
      useClass: TypeOrmPartWearRepository,
    },
  ],
  controllers: [PartWearController],
  exports: [
    PART_WEAR_REPOSITORY,
    CalculatePartWearUseCase,
    GetPartWearUseCase,
    GetMotorcyclePartsWearUseCase,
    GetPartsDueForMaintenanceUseCase,
  ],
})
export class PartWearModule {}
