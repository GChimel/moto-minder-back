import {
  Inject,
  Injectable,
  Logger,
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
  private readonly logger = new Logger(LoginUseCase.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,

    @Inject(AUTH_TOKEN_GENERATOR)
    private readonly authTokenGenerator: IAuthTokenGenerator,
  ) {}

  async execute(dto: LoginDto): Promise<{ token: string }> {
    this.logger.log(`Login attempt for email: ${dto.email}`);

    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      this.logger.warn(`Login failed: User not found for email: ${dto.email}`);
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await UserPassword.compare(dto.password, user);

    if (isPasswordValid == false) {
      this.logger.warn(
        `Login failed: Invalid password for user: ${user.getId().getValue()}`,
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: AuthTokenPayload = {
      sub: user.getId().getValue(),
    };

    const token = await this.authTokenGenerator.generate(payload);

    this.logger.log(`Login successful for user: ${user.getId().getValue()}`);

    return { token };
  }
}
