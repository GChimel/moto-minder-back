import { StravaOAuthAdapter } from './strava-oauth.adapter';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('StravaOAuthAdapter', () => {
  let adapter: StravaOAuthAdapter;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(() => {
    configService = {
      get: jest.fn((key: string) => {
        const config: Record<string, string> = {
          STRAVA_CLIENT_ID: 'test-client-id',
          STRAVA_CLIENT_SECRET: 'test-client-secret',
          STRAVA_REDIRECT_URI:
            'http://localhost:3000/auth/oauth/strava/callback',
        };
        return config[key];
      }),
    } as unknown as jest.Mocked<ConfigService>;

    adapter = new StravaOAuthAdapter(configService);
  });

  describe('constructor', () => {
    it('should initialize with valid config', () => {
      expect(adapter).toBeDefined();
    });

    it('should throw error if STRAVA_CLIENT_ID is missing', () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'STRAVA_CLIENT_ID') return undefined;
        return 'test-value';
      });

      expect(() => new StravaOAuthAdapter(configService)).toThrow(
        'Missing Strava OAuth configuration',
      );
    });

    it('should throw error if STRAVA_CLIENT_SECRET is missing', () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'STRAVA_CLIENT_SECRET') return undefined;
        return 'test-value';
      });

      expect(() => new StravaOAuthAdapter(configService)).toThrow(
        'Missing Strava OAuth configuration',
      );
    });

    it('should throw error if STRAVA_REDIRECT_URI is missing', () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'STRAVA_REDIRECT_URI') return undefined;
        return 'test-value';
      });

      expect(() => new StravaOAuthAdapter(configService)).toThrow(
        'Missing Strava OAuth configuration',
      );
    });
  });

  describe('getProfile', () => {
    it('should return OAuthProfile with strava provider', async () => {
      const mockCode = 'auth-code-123';

      const mockTokenResponse = {
        token_type: 'Bearer',
        expires_at: 1234567890,
        expires_in: 21600,
        refresh_token: 'refresh-token',
        access_token: 'access-token',
        athlete: {
          id: 12345,
          username: 'testuser',
          firstname: 'John',
          lastname: 'Doe',
          city: 'San Francisco',
          state: 'California',
          country: 'USA',
          sex: 'M',
          summit: true,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
          badge_type_id: 1,
          weight: 70,
          profile_medium: 'https://example.com/profile-medium.jpg',
          profile: 'https://example.com/profile.jpg',
          friend: false,
          follower: false,
        },
      };

      jest
        .spyOn(adapter as any, 'exchangeCodeForTokens')
        .mockResolvedValue(mockTokenResponse);

      const result = await adapter.getProfile(mockCode);

      expect(result).toEqual({
        id: '12345',
        email: 'athlete-12345@strava.local',
        name: 'John Doe',
        avatar: 'https://example.com/profile-medium.jpg',
        provider: 'strava',
      });
    });

    it('should throw BadRequestException if exchange fails', async () => {
      const mockCode = 'invalid-code';

      jest
        .spyOn(adapter as any, 'exchangeCodeForTokens')
        .mockRejectedValue(new Error('Exchange failed'));

      await expect(adapter.getProfile(mockCode)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('refreshToken', () => {
    it('should return new OAuthTokens', async () => {
      const mockRefreshToken = 'refresh-token';

      const mockTokenResponse = {
        token_type: 'Bearer',
        expires_at: 1234567890,
        expires_in: 21600,
        refresh_token: 'new-refresh-token',
        access_token: 'new-access-token',
        athlete: {
          id: 12345,
          username: 'testuser',
          firstname: 'John',
          lastname: 'Doe',
          city: 'San Francisco',
          state: 'California',
          country: 'USA',
          sex: 'M',
          summit: true,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
          badge_type_id: 1,
          weight: 70,
          profile_medium: 'https://example.com/profile-medium.jpg',
          profile: 'https://example.com/profile.jpg',
          friend: false,
          follower: false,
        },
      };

      mockedAxios.post.mockResolvedValue({ data: mockTokenResponse });

      const result = await adapter.refreshToken(mockRefreshToken);

      expect(result).toEqual({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        expiresIn: 21600,
      });
    });

    it('should throw BadRequestException if refresh fails', async () => {
      const mockRefreshToken = 'invalid-refresh-token';

      mockedAxios.post.mockRejectedValue(new Error('Network error'));

      await expect(adapter.refreshToken(mockRefreshToken)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
