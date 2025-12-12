import { IsOptional, IsString } from 'class-validator';

export class UpdateRideNotesDto {
  @IsOptional()
  @IsString()
  notes?: string;
}
