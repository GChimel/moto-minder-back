import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserModelDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(255, { message: 'Name must be at most 255 characters long' })
  name?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255, { message: 'Email must be at most 255 characters long' })
  email?: string;

  @IsOptional()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password?: string;
}
