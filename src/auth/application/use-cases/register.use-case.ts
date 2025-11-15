import {
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../user/application/ports/user.repository.port';
import { User } from '../../../user/domain/entities/user.entity';
import {
  AUTH_TOKEN_GENERATOR,
  AuthTokenPayload,
  IAuthTokenGenerator,
} from '../ports/auth-token-generator.port';

interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,

    @Inject(AUTH_TOKEN_GENERATOR)
    private readonly authTokenGenerator: IAuthTokenGenerator,
  ) {}

  async execute(dto: RegisterDto): Promise<{ token: string; user: User }> {
    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await User.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
    });

    const savedUser = await this.userRepository.save(user);

    const payload: AuthTokenPayload = {
      sub: savedUser.getId().getValue(),
    };

    const token = await this.authTokenGenerator.generate(payload);

    return { token, user: savedUser };
  }
}
