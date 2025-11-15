import { Injectable } from '@nestjs/common';
import {
  AuthTokenPayload,
  IAuthTokenGenerator,
} from '../../application/ports/auth-token-generator.port';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtTokenGeneratorAdapter implements IAuthTokenGenerator {
  constructor(private readonly jwtService: JwtService) {}

  async generate(payload: AuthTokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
