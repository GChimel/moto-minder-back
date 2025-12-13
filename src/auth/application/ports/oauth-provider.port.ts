export interface OAuthProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: 'google' | 'garmin' | 'strava';
}

export interface OAuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface IOAuthProvider {
  getProfile(code: string): Promise<OAuthProfile>;
  refreshToken(refreshToken: string): Promise<OAuthTokens>;
}

export const GOOGLE_OAUTH_PROVIDER = 'GOOGLE_OAUTH_PROVIDER';
export const GARMIN_OAUTH_PROVIDER = 'GARMIN_OAUTH_PROVIDER';
export const STRAVA_OAUTH_PROVIDER = 'STRAVA_OAUTH_PROVIDER';
