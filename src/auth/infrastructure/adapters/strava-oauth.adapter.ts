import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  IOAuthProvider,
  OAuthProfile,
  OAuthTokens,
} from '../../application/ports/oauth-provider.port';

interface StravaTokenResponse {
  token_type: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  access_token: string;
  athlete: {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
    city: string;
    state: string;
    country: string;
    sex: string;
    summit: boolean;
    created_at: string;
    updated_at: string;
    badge_type_id: number;
    weight: number;
    profile_medium: string;
    profile: string;
    friend: boolean;
    follower: boolean;
  };
}

@Injectable()
export class StravaOAuthAdapter implements IOAuthProvider {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private readonly tokenUrl = 'https://www.strava.com/oauth/token';
  private readonly athleteUrl = 'https://www.strava.com/api/v3/athlete';

  constructor(private configService: ConfigService) {
    this.clientId = this.configService.get<string>(
      'STRAVA_CLIENT_ID',
    ) as string;
    this.clientSecret = this.configService.get<string>(
      'STRAVA_CLIENT_SECRET',
    ) as string;
    this.redirectUri = this.configService.get<string>(
      'STRAVA_REDIRECT_URI',
    ) as string;

    if (!this.clientId || !this.clientSecret || !this.redirectUri) {
      throw new Error('Missing Strava OAuth configuration');
    }
  }

  async getProfile(code: string): Promise<OAuthProfile> {
    try {
      const tokenResponse = await this.exchangeCodeForTokens(code);

      const athlete = tokenResponse.athlete;

      return {
        id: String(athlete.id),
        email: `athlete-${athlete.id}@strava.local`,
        name: `${athlete.firstname} ${athlete.lastname}`,
        avatar: athlete.profile_medium,
        provider: 'strava',
      };
    } catch {
      throw new BadRequestException('Failed to get Strava OAuth profile');
    }
  }

  async refreshToken(refreshToken: string): Promise<OAuthTokens> {
    try {
      const response = await axios.post<StravaTokenResponse>(this.tokenUrl, {
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
      throw new BadRequestException('Failed to refresh Strava OAuth token');
    }
  }

  private async exchangeCodeForTokens(
    code: string,
  ): Promise<StravaTokenResponse> {
    const response = await axios.post<StravaTokenResponse>(this.tokenUrl, {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code,
      grant_type: 'authorization_code',
    });

    return response.data;
  }
}
