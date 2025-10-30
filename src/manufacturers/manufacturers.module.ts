import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManufacturerSchema } from './infrastructure/persistence/manufacturer.schema';
import { TypeOrmManufacturerRepository } from './infrastructure/adapters/typeorm-manufacturer.repository';
import { MANUFACTURER_REPOSITORY } from './application/ports/manufacturer.repository.port';
import { CreateManufacturerUseCase } from './application/use-cases/create-manufacturer.use-case';
import { FindAllManufacturersUseCase } from './application/use-cases/find-all-manufacturers.use-case';
import { FindManufacturerByIdUseCase } from './application/use-cases/find-manufacturer-by-id.use-case';
import { FindManufacturerByNameUseCase } from './application/use-cases/find-manufacturer-by-name.use-case';
import { ManufacturersController } from './presentation/manufacturers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ManufacturerSchema])],
  providers: [
    CreateManufacturerUseCase,
    FindAllManufacturersUseCase,
    FindManufacturerByIdUseCase,
    FindManufacturerByNameUseCase,
    {
      provide: MANUFACTURER_REPOSITORY,
      useClass: TypeOrmManufacturerRepository,
    },
  ],
  controllers: [ManufacturersController],
})
export class ManufacturersModule {}
