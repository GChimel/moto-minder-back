import { IsString, IsIn } from 'class-validator';

export class OAuthLoginDto {
  @IsString()
  code: string;

  @IsIn(['google', 'garmin'])
  provider: 'google' | 'garmin';
}
