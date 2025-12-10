import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import {
  GOOGLE_OAUTH_PROVIDER,
  GARMIN_OAUTH_PROVIDER,
  IOAuthProvider,
} from '../ports/oauth-provider.port';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../user/application/ports/user.repository.port';
import {
  AUTH_TOKEN_GENERATOR,
  IAuthTokenGenerator,
} from '../ports/auth-token-generator.port';
import { User } from '../../../user/domain/entities/user.entity';

export interface OAuthLoginDto {
  code: string;
  provider: 'google' | 'garmin';
}

@Injectable()
export class OAuthLoginUseCase {
  constructor(
    @Inject(GOOGLE_OAUTH_PROVIDER)
    private readonly googleOAuthProvider: IOAuthProvider,
    @Inject(GARMIN_OAUTH_PROVIDER)
    private readonly garminOAuthProvider: IOAuthProvider,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(AUTH_TOKEN_GENERATOR)
    private readonly authTokenGenerator: IAuthTokenGenerator,
  ) {}

  async execute(dto: OAuthLoginDto): Promise<{ token: string; user: User }> {

    const oauthProvider = this.getOAuthProvider(dto.provider);

    const profile = await oauthProvider.getProfile(dto.code);

    let user = await this.userRepository.findByEmail(profile.email);

    if (!user) {
      user = await User.create({
        name: profile.name,
        email: profile.email,
        password: `oauth_${profile.provider}_${profile.id}`,
      });
      user = await this.userRepository.save(user);
    }

    const token = await this.authTokenGenerator.generate({
      sub: user.getId().getValue(),
    });

    return { token, user };
  }

  private getOAuthProvider(provider: string): IOAuthProvider {
    switch (provider) {
      case 'google':
        return this.googleOAuthProvider;
      case 'garmin':
        return this.garminOAuthProvider;
      default:
        throw new BadRequestException(
          `Unsupported OAuth provider: ${provider}`,
        );
    }
  }
}
