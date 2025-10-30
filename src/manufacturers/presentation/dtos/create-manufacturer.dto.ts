import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateManufacturerDto {
  @IsNotEmpty({
    message: 'Name is required and must be at least 2 characters long',
  })
  @IsString({
    message: 'Name is required and must be at least 2 characters long',
  })
  @MinLength(2)
  name: string;
}
