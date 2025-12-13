import {
  IsString,
  IsUUID,
  IsInt,
  Min,
  Max,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateUserMotocycleDto {
  @IsNotEmpty()
  @IsUUID()
  motocycleModelId: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1, { message: 'Nickname must be at least 1 character long' })
  @MaxLength(100, { message: 'Nickname must be at most 100 characters long' })
  nickname: string;

  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  manufacturingYear: number;

  @IsInt()
  @Min(0)
  @Max(1000000)
  currentOdometer: number;
}
