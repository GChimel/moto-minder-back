export interface AuthTokenPayload {
  sub: string;
}

export const AUTH_TOKEN_GENERATOR = Symbol('AUTH_TOKEN_GENERATOR');

export interface IAuthTokenGenerator {
  generate(payload: AuthTokenPayload): Promise<string>;
}
