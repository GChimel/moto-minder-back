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
import { OAuthLoginUseCase } from './application/use-cases/oauth-login.use-case';
import { AUTH_TOKEN_GENERATOR } from './application/ports/auth-token-generator.port';
import {
  GOOGLE_OAUTH_PROVIDER,
  GARMIN_OAUTH_PROVIDER,
  STRAVA_OAUTH_PROVIDER,
} from './application/ports/oauth-provider.port';
import { JwtTokenGeneratorAdapter } from './infrastructure/adapters/jwt-token-generator.adapter';
import { GoogleOAuthAdapter } from './infrastructure/adapters/google-oauth.adapter';
import { GarminOAuthAdapter } from './infrastructure/adapters/garmin-oauth.adapter';
import { StravaOAuthAdapter } from './infrastructure/adapters/strava-oauth.adapter';
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
    OAuthLoginUseCase,
    JwtStrategy,
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository,
    },
    {
      provide: AUTH_TOKEN_GENERATOR,
      useClass: JwtTokenGeneratorAdapter,
    },
    {
      provide: GOOGLE_OAUTH_PROVIDER,
      useClass: GoogleOAuthAdapter,
    },
    {
      provide: GARMIN_OAUTH_PROVIDER,
      useClass: GarminOAuthAdapter,
    },
    {
      provide: STRAVA_OAUTH_PROVIDER,
      useClass: StravaOAuthAdapter,
    },
  ],
  controllers: [AuthController],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
