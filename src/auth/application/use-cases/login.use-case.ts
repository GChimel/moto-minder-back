import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../user/application/ports/user.repository.port';
import {
  AUTH_TOKEN_GENERATOR,
  AuthTokenPayload,
  IAuthTokenGenerator,
} from '../ports/auth-token-generator.port';
import { UserPassword } from '../../../user/domain/value-objects/user-password.vo';

interface LoginDto {
  email: string;
  password: string;
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,

    @Inject(AUTH_TOKEN_GENERATOR)
    private readonly authTokenGenerator: IAuthTokenGenerator,
  ) {}

  async execute(dto: LoginDto): Promise<{ token: string }> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await UserPassword.compare(dto.password, user);

    if (isPasswordValid == false) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: AuthTokenPayload = {
      sub: user.getId().getValue(),
    };

    const token = await this.authTokenGenerator.generate(payload);

    return { token };
  }
}
