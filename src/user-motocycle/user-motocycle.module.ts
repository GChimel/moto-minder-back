import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { USER_MOTOCYCLE_REPOSITORY } from './application/ports/user-motocycle.repository.port';
import { CreateUserMotocycleUseCase } from './application/use-cases/create-user-motocycle.use-case';
import { FindUserMotocyclesUseCase } from './application/use-cases/find-user-motocycles.use-case';
import { FindUserMotocycleByIdUseCase } from './application/use-cases/find-user-motocycle-by-id.use-case';
import { FindMotocyclesByUserUseCase } from './application/use-cases/find-motocycles-by-user.use-case';
import { UpdateUserMotocycleUseCase } from './application/use-cases/update-user-motocycle.use-case';
import { DeleteUserMotocycleUseCase } from './application/use-cases/delete-user-motocycle.use-case';
import { TypeOrmUserMotocycleRepository } from './infrastructure/adapters/typeorm-user-motocycle.repository';
import { UserMotocycleSchema } from './infrastructure/persistence/user-motocycle.schema';
import { UserMotocycleController } from './presentation/user-motocycle.controller';
import { UserModule } from '../user/user.module';
import { MotocycleModelsModule } from '../motocycle-model/motocycle-models.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserMotocycleSchema]),
    UserModule,
    MotocycleModelsModule,
  ],
  providers: [
    CreateUserMotocycleUseCase,
    FindUserMotocyclesUseCase,
    FindUserMotocycleByIdUseCase,
    FindMotocyclesByUserUseCase,
    UpdateUserMotocycleUseCase,
    DeleteUserMotocycleUseCase,
    {
      provide: USER_MOTOCYCLE_REPOSITORY,
      useClass: TypeOrmUserMotocycleRepository,
    },
  ],
  controllers: [UserMotocycleController],
  exports: [USER_MOTOCYCLE_REPOSITORY],
})
export class UserMotocycleModule {}
