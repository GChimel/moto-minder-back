import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  IOAuthProvider,
  OAuthProfile,
  OAuthTokens,
} from '../../application/ports/oauth-provider.port';

interface GoogleTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

@Injectable()
export class GoogleOAuthAdapter implements IOAuthProvider {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private readonly tokenUrl = 'https://oauth2.googleapis.com/token';
  private readonly userInfoUrl =
    'https://www.googleapis.com/oauth2/v2/userinfo';

  constructor(private configService: ConfigService) {
    this.clientId = this.configService.get<string>(
      'GOOGLE_CLIENT_ID',
    ) as string;
    this.clientSecret = this.configService.get<string>(
      'GOOGLE_CLIENT_SECRET',
    ) as string;
    this.redirectUri = this.configService.get<string>(
      'GOOGLE_REDIRECT_URI',
    ) as string;

    if (!this.clientId || !this.clientSecret || !this.redirectUri) {
      throw new Error('Missing Google OAuth configuration');
    }
  }

  async getProfile(code: string): Promise<OAuthProfile> {
    try {
      // Exchange authorization code for tokens
      const tokens = await this.exchangeCodeForTokens(code);

      // Get user info using access token
      const userInfo = await this.getUserInfo(tokens.access_token);

      return {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        avatar: userInfo.picture,
        provider: 'google',
      };
    } catch {
      throw new BadRequestException('Failed to get Google OAuth profile');
    }
  }

  async refreshToken(refreshToken: string): Promise<OAuthTokens> {
    try {
      const response = await axios.post<GoogleTokenResponse>(this.tokenUrl, {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      });

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
      };
    } catch {
      throw new BadRequestException('Failed to refresh Google OAuth token');
    }
  }

  private async exchangeCodeForTokens(
    code: string,
  ): Promise<GoogleTokenResponse> {
    const response = await axios.post<GoogleTokenResponse>(this.tokenUrl, {
      code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      grant_type: 'authorization_code',
    });

    return response.data;
  }

  private async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    const response = await axios.get<GoogleUserInfo>(this.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  }
}
