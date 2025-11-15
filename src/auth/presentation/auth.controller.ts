import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { RegisterUseCase } from '../application/use-cases/register.use-case';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { AuthResponseDto } from './dtos/auth-response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    const { token, user } = await this.registerUseCase.execute(dto);

    return {
      token,
      user: {
        id: user.getId().getValue(),
        name: user.getName(),
        email: user.getEmail().getValue(),
      },
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<{ token: string }> {
    return this.loginUseCase.execute(dto);
  }
}
