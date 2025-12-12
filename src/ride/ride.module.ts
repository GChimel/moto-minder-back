import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RideSchema } from './infrastructure/persistence/ride.schema';
import { TypeOrmRideRepository } from './infrastructure/adapters/typeorm-ride.repository';
import { RIDE_REPOSITORY } from './application/ports/ride.repository.port';
import { StartRideUseCase } from './application/use-cases/start-ride.use-case';
import { CompleteRideUseCase } from './application/use-cases/complete-ride.use-case';
import { FindRidesByMotorcycleUseCase } from './application/use-cases/find-rides-by-motorcycle.use-case';
import { GetRideStatisticsUseCase } from './application/use-cases/get-ride-statistics.use-case';
import { GetRideUseCase } from './application/use-cases/get-ride.use-case';
import { CancelRideUseCase } from './application/use-cases/cancel-ride.use-case';
import { UpdateRideNotesUseCase } from './application/use-cases/update-ride-notes.use-case';
import { DeleteRideUseCase } from './application/use-cases/delete-ride.use-case';
import { RideController } from './presentation/ride.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RideSchema])],
  providers: [
    {
      provide: RIDE_REPOSITORY,
      useClass: TypeOrmRideRepository,
    },
    StartRideUseCase,
    CompleteRideUseCase,
    FindRidesByMotorcycleUseCase,
    GetRideStatisticsUseCase,
    GetRideUseCase,
    CancelRideUseCase,
    UpdateRideNotesUseCase,
    DeleteRideUseCase,
  ],
  controllers: [RideController],
  exports: [RIDE_REPOSITORY],
})
export class RideModule {}
