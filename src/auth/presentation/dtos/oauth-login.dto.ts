import { IsString, IsIn, IsNotEmpty } from 'class-validator';

export class OAuthLoginDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsIn(['google', 'garmin'])
  provider: 'google' | 'garmin';
}
