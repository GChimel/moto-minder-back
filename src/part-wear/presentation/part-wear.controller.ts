import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard';
import { CalculatePartWearUseCase } from '../application/use-cases/calculate-part-wear.use-case';
import { GetPartWearUseCase } from '../application/use-cases/get-part-wear.use-case';
import { GetMotorcyclePartsWearUseCase } from '../application/use-cases/get-motorcycle-parts-wear.use-case';
import { GetPartsDueForMaintenanceUseCase } from '../application/use-cases/get-parts-due-for-maintenance.use-case';
import { PartWearResponseDto } from './dtos/part-wear-response.dto';
import { CalculateWearDto } from './dtos/calculate-wear.dto';
import {
  PartWearNotFoundException,
  InvalidWearCalculationException,
} from '../domain/exceptions/part-wear.exceptions';

@Controller('part-wear')
@UseGuards(JwtAuthGuard)
export class PartWearController {
  constructor(
    private readonly calculatePartWearUseCase: CalculatePartWearUseCase,
    private readonly getPartWearUseCase: GetPartWearUseCase,
    private readonly getMotorcyclePartsWearUseCase: GetMotorcyclePartsWearUseCase,
    private readonly getPartsDueForMaintenanceUseCase: GetPartsDueForMaintenanceUseCase,
  ) {}

  @Get(':id')
  @HttpCode(200)
  async getPartWear(
    @Param('id') partWearId: string,
  ): Promise<PartWearResponseDto> {
    try {
      const partWear = await this.getPartWearUseCase.execute(partWearId);
      return new PartWearResponseDto(partWear);
    } catch (error) {
      if (error instanceof PartWearNotFoundException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Get('motorcycle/:userMotocycleId')
  @HttpCode(200)
  async getMotorcyclePartsWear(
    @Param('userMotocycleId') userMotocycleId: string,
  ): Promise<PartWearResponseDto[]> {
    const partWears =
      await this.getMotorcyclePartsWearUseCase.execute(userMotocycleId);
    return PartWearResponseDto.mapMultiple(partWears);
  }

  @Get('motorcycle/:userMotocycleId/due')
  @HttpCode(200)
  async getPartsDueForMaintenance(
    @Param('userMotocycleId') userMotocycleId: string,
  ): Promise<PartWearResponseDto[]> {
    const partWears =
      await this.getPartsDueForMaintenanceUseCase.execute(userMotocycleId);
    return PartWearResponseDto.mapMultiple(partWears);
  }

  @Post(':id/calculate')
  @HttpCode(200)
  async calculateWear(
    @Param('id') partWearId: string,
    @Body() dto: CalculateWearDto,
  ): Promise<PartWearResponseDto> {
    try {
      const result = await this.calculatePartWearUseCase.execute(
        partWearId,
        dto.currentOdometer,
      );
      return new PartWearResponseDto(result.partWear);
    } catch (error) {
      if (error instanceof PartWearNotFoundException) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof InvalidWearCalculationException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
}
