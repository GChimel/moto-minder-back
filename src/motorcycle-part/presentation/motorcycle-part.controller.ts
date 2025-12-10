import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { InstallPartUseCase } from '../application/use-cases/install-part.use-case';
import { FindPartsByMotorcycleUseCase } from '../application/use-cases/find-parts-by-motorcycle.use-case';
import { FindActivePartsByMotorcycleUseCase } from '../application/use-cases/find-active-parts-by-motorcycle.use-case';
import {
  ReplacePartUseCase,
  ReplacePartData,
} from '../application/use-cases/replace-part.use-case';
import { UpdatePartUseCase } from '../application/use-cases/update-part.use-case';
import { DeletePartUseCase } from '../application/use-cases/delete-part.use-case';
import { InstallPartDto } from './dtos/install-part.dto';
import { UpdatePartDto } from './dtos/update-part.dto';
import { ReplacePartDto } from './dtos/replace-part.dto';
import { MotorcyclePartResponseDto } from './dtos/motorcycle-part-response.dto';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt.guard';
import { MotorcyclePart } from '../domain/entities/motorcycle-part.entity';

@Controller('motorcycle-parts')
@UseGuards(JwtAuthGuard)
export class MotorcyclePartController {
  constructor(
    private readonly installPartUseCase: InstallPartUseCase,
    private readonly findPartsByMotorcycleUseCase: FindPartsByMotorcycleUseCase,
    private readonly findActivePartsByMotorcycleUseCase: FindActivePartsByMotorcycleUseCase,
    private readonly replacePartUseCase: ReplacePartUseCase,
    private readonly updatePartUseCase: UpdatePartUseCase,
    private readonly deletePartUseCase: DeletePartUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async installPart(
    @Body() dto: InstallPartDto,
  ): Promise<MotorcyclePartResponseDto> {
    const part = await this.installPartUseCase.execute({
      userMotocycleId: dto.userMotocycleId,
      partType: dto.partType,
      partCategory: dto.partCategory,
      name: dto.name,
      manufacturer: dto.manufacturer,
      model: dto.model,
      installationDate: new Date(dto.installationDate),
      installationOdometer: dto.installationOdometer,
      expectedLifespanKm: dto.expectedLifespanKm,
      expectedLifespanMonths: dto.expectedLifespanMonths,
      wearRatePerKm: dto.wearRatePerKm,
      replacementThreshold: dto.replacementThreshold,
      notes: dto.notes,
    });
    return this.mapToResponse(part);
  }

  @Get('motorcycle/:userMotocycleId')
  @HttpCode(HttpStatus.OK)
  async findByMotorcycle(
    @Param('userMotocycleId') userMotocycleId: string,
  ): Promise<MotorcyclePartResponseDto[]> {
    const parts =
      await this.findPartsByMotorcycleUseCase.execute(userMotocycleId);
    return parts.map((part) => this.mapToResponse(part));
  }

  @Get('motorcycle/:userMotocycleId/active')
  @HttpCode(HttpStatus.OK)
  async findActiveByMotorcycle(
    @Param('userMotocycleId') userMotocycleId: string,
  ): Promise<MotorcyclePartResponseDto[]> {
    const parts =
      await this.findActivePartsByMotorcycleUseCase.execute(userMotocycleId);
    return parts.map((part) => this.mapToResponse(part));
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updatePart(
    @Param('id') id: string,
    @Body() dto: UpdatePartDto,
  ): Promise<MotorcyclePartResponseDto> {
    const part = await this.updatePartUseCase.execute(id, dto);
    return this.mapToResponse(part);
  }

  @Post(':id/replace')
  @HttpCode(HttpStatus.CREATED)
  async replacePart(
    @Param('id') id: string,
    @Body() dto: ReplacePartDto,
  ): Promise<MotorcyclePartResponseDto> {
    const replaceData: ReplacePartData = {
      expectedLifespanKm: dto.expectedLifespanKm,
      expectedLifespanMonths: dto.expectedLifespanMonths,
      wearRatePerKm: dto.wearRatePerKm,
      replacementThreshold: dto.replacementThreshold,
      notes: dto.notes,
    };
    const result = await this.replacePartUseCase.execute(id, replaceData);
    return this.mapToResponse(result.newPart);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePart(@Param('id') id: string): Promise<void> {
    await this.deletePartUseCase.execute(id);
  }

  private mapToResponse(part: MotorcyclePart): MotorcyclePartResponseDto {
    const expectedLifespan = part.getExpectedLifespanKm();
    return new MotorcyclePartResponseDto(
      part.getId().getValue(),
      part.getUserMotocycleId().getValue(),
      part.getPartType(),
      part.getPartCategory(),
      part.getName(),
      part.getManufacturer(),
      part.getModel(),
      part.getInstallationDate(),
      part.getInstallationOdometer().getValue(),
      expectedLifespan?.getLifespanKm(),
      expectedLifespan?.getLifespanMonths(),
      part.getWearRatePerKm()?.getValue(),
      part.getReplacementThreshold(),
      part.getNotes(),
      part.getIsActive(),
      part.getCreatedAt(),
      part.getUpdatedAt(),
    );
  }
}
