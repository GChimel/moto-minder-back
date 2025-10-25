import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserUseCase } from './application/use-cases/create-user.user-case';
import { USER_REPOSITORY } from './application/ports/user.repository.port';
import { TypeOrmUserRepository } from './infrastructure/adapters/typeorm-user.repository';
import { UserSchema } from './infrastructure/persistence/user.schema';
import { UserController } from './presentation/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserSchema])],
  providers: [
    CreateUserUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository,
    },
  ],
  controllers: [UserController],
})
export class UserModule {}
