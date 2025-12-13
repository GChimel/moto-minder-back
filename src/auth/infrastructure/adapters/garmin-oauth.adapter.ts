import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  IOAuthProvider,
  OAuthProfile,
  OAuthTokens,
} from '../../application/ports/oauth-provider.port';

interface GarminTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

interface GarminUserInfo {
  id: string;
  email: string;
  displayName: string;
  profileImageUrl?: string;
}

@Injectable()
export class GarminOAuthAdapter implements IOAuthProvider {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private readonly tokenUrl =
    'https://auth.garmin.com/oauth-service/oauth/token';
  private readonly userInfoUrl =
    'https://apis.garmin.com/userprofile-service/userprofile/v2/socialProfile';

  constructor(private configService: ConfigService) {
    this.clientId = this.configService.get<string>(
      'GARMIN_CLIENT_ID',
    ) as string;
    this.clientSecret = this.configService.get<string>(
      'GARMIN_CLIENT_SECRET',
    ) as string;
    this.redirectUri = this.configService.get<string>(
      'GARMIN_REDIRECT_URI',
    ) as string;

    if (!this.clientId || !this.clientSecret || !this.redirectUri) {
      console.warn(
        'Garmin OAuth adapter initialized but configuration is missing. Garmin OAuth will be disabled.',
      );
    }
  }

  async getProfile(code: string): Promise<OAuthProfile> {
    if (!this.clientId || !this.clientSecret || !this.redirectUri) {
      throw new BadRequestException(
        'Garmin OAuth is not configured. Please set GARMIN_CLIENT_ID, GARMIN_CLIENT_SECRET, and GARMIN_REDIRECT_URI environment variables.',
      );
    }
    try {
      const tokens = await this.exchangeCodeForTokens(code);

      const userInfo = await this.getUserInfo(tokens.access_token);

      return {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.displayName,
        avatar: userInfo.profileImageUrl,
        provider: 'garmin',
      };
    } catch {
      throw new BadRequestException('Failed to get Garmin OAuth profile');
    }
  }

  async refreshToken(refreshToken: string): Promise<OAuthTokens> {
    try {
      const response = await axios.post<GarminTokenResponse>(
        this.tokenUrl,
        {
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        },
        {
          auth: {
            username: this.clientId,
            password: this.clientSecret,
          },
        },
      );

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
      };
    } catch {
      throw new BadRequestException('Failed to refresh Garmin OAuth token');
    }
  }

  private async exchangeCodeForTokens(
    code: string,
  ): Promise<GarminTokenResponse> {
    const response = await axios.post<GarminTokenResponse>(
      this.tokenUrl,
      {
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUri,
      },
      {
        auth: {
          username: this.clientId,
          password: this.clientSecret,
        },
      },
    );

    return response.data;
  }

  private async getUserInfo(accessToken: string): Promise<GarminUserInfo> {
    const response = await axios.get<GarminUserInfo>(this.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  }
}
