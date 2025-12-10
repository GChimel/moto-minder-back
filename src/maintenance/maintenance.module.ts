import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenanceRecordSchema } from './infrastructure/persistence/maintenance-record.schema';
import { TypeOrmMaintenanceRecordRepository } from './infrastructure/adapters/typeorm-maintenance-record.repository';
import { MAINTENANCE_RECORD_REPOSITORY } from './application/ports/maintenance-record.repository.port';
import { CreateMaintenanceRecordUseCase } from './application/use-cases/create-maintenance-record.use-case';
import { FindMaintenanceByMotorcycleUseCase } from './application/use-cases/find-maintenance-by-motorcycle.use-case';
import { FindUpcomingMaintenanceUseCase } from './application/use-cases/find-upcoming-maintenance.use-case';
import { UpdateMaintenanceRecordUseCase } from './application/use-cases/update-maintenance-record.use-case';
import { DeleteMaintenanceRecordUseCase } from './application/use-cases/delete-maintenance-record.use-case';
import { GetMaintenanceHistoryUseCase } from './application/use-cases/get-maintenance-history.use-case';
import { MaintenanceController } from './presentation/maintenance.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MaintenanceRecordSchema])],
  controllers: [MaintenanceController],
  providers: [
    {
      provide: MAINTENANCE_RECORD_REPOSITORY,
      useClass: TypeOrmMaintenanceRecordRepository,
    },
    CreateMaintenanceRecordUseCase,
    FindMaintenanceByMotorcycleUseCase,
    FindUpcomingMaintenanceUseCase,
    UpdateMaintenanceRecordUseCase,
    DeleteMaintenanceRecordUseCase,
    GetMaintenanceHistoryUseCase,
  ],
  exports: [MAINTENANCE_RECORD_REPOSITORY],
})
export class MaintenanceModule {}
