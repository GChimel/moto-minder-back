import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchema } from '../user/infrastructure/persistence/user.schema';
import { USER_REPOSITORY } from '../user/application/ports/user.repository.port';
import { TypeOrmUserRepository } from '../user/infrastructure/adapters/typeorm-user.repository';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { AUTH_TOKEN_GENERATOR } from './application/ports/auth-token-generator.port';
import { JwtTokenGeneratorAdapter } from './infrastructure/adapters/jwt-token-generator.adapter';
import { JwtStrategy } from './presentation/jwt.strategy';
import { AuthController } from './presentation/auth.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => {
        const expiresIn = config.get<string>('JWT_EXPIRES_IN', '7d');
        return {
          secret: config.getOrThrow<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: expiresIn as `${number}d` | `${number}h` | `${number}m`,
          },
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserSchema]),
  ],
  providers: [
    LoginUseCase,
    RegisterUseCase,
    JwtStrategy,
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository,
    },
    {
      provide: AUTH_TOKEN_GENERATOR,
      useClass: JwtTokenGeneratorAdapter,
    },
  ],
  controllers: [AuthController],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
