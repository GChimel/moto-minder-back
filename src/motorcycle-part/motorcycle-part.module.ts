import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MOTORCYCLE_PART_REPOSITORY } from './application/ports/motorcycle-part.repository.port';
import { InstallPartUseCase } from './application/use-cases/install-part.use-case';
import { FindPartsByMotorcycleUseCase } from './application/use-cases/find-parts-by-motorcycle.use-case';
import { FindActivePartsByMotorcycleUseCase } from './application/use-cases/find-active-parts-by-motorcycle.use-case';
import { ReplacePartUseCase } from './application/use-cases/replace-part.use-case';
import { UpdatePartUseCase } from './application/use-cases/update-part.use-case';
import { DeletePartUseCase } from './application/use-cases/delete-part.use-case';
import { TypeOrmMotorcyclePartRepository } from './infrastructure/adapters/typeorm-motorcycle-part.repository';
import { MotorcyclePartSchema } from './infrastructure/persistence/motorcycle-part.schema';
import { MotorcyclePartController } from './presentation/motorcycle-part.controller';
import { UserMotocycleModule } from '../user-motocycle/user-motocycle.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MotorcyclePartSchema]),
    UserMotocycleModule,
  ],
  providers: [
    InstallPartUseCase,
    FindPartsByMotorcycleUseCase,
    FindActivePartsByMotorcycleUseCase,
    ReplacePartUseCase,
    UpdatePartUseCase,
    DeletePartUseCase,
    {
      provide: MOTORCYCLE_PART_REPOSITORY,
      useClass: TypeOrmMotorcyclePartRepository,
    },
  ],
  controllers: [MotorcyclePartController],
  exports: [
    MOTORCYCLE_PART_REPOSITORY,
    FindActivePartsByMotorcycleUseCase,
    InstallPartUseCase,
  ],
})
export class MotorcyclePartModule {}
