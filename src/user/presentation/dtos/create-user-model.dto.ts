import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserModelDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Name must be at least 3 characters long' })
  @MaxLength(255, { message: 'Name must be at most 255 characters long' })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255, { message: 'Email must be at most 255 characters long' })
  email: string;

  @IsOptional()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password?: string;
}
