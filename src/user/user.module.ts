import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { USER_REPOSITORY } from './application/ports/user.repository.port';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { FindAllUsersUseCase } from './application/use-cases/find-all-users.use-case';
import { FindUserByIdUseCase } from './application/use-cases/find-user-by-id.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { TypeOrmUserRepository } from './infrastructure/adapters/typeorm-user.repository';
import { UserSchema } from './infrastructure/persistence/user.schema';
import { UserController } from './presentation/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserSchema])],
  providers: [
    CreateUserUseCase,
    FindAllUsersUseCase,
    FindUserByIdUseCase,
    UpdateUserUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository,
    },
  ],
  controllers: [UserController],
})
export class UserModule {}
