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
import { CreateMotocycleModelUseCase } from '../application/use-cases/create-motocycle-model.use-case';
import { UpdateMotocycleModelUseCase } from '../application/use-cases/update-motocycle-model.use-case';
import { DeleteMotocycleModelUseCase } from '../application/use-cases/delete-motocycle-model.use-case';
import { FindMotocycleModelByIdUseCase } from '../application/use-cases/find-motocycle-model-by-id.use-case';
import { FindAllMotocycleModelsUseCase } from '../application/use-cases/find-all-motocycle-models.use-case';
import { FindMotocycleModelsByManufacturerUseCase } from '../application/use-cases/find-motocycle-models-by-manufacturer.use-case';
import { CreateMotocycleModelDto } from './dtos/create-motocycle-model.dto';
import { UpdateMotocycleModelDto } from './dtos/update-motocycle-model.dto';
import { MotocycleModelResponseDto } from './dtos/motocycle-model-response.dto';
import { MotocycleModel } from '../domain/entities/motocycle-model.entity';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt.guard';

@Controller('motocycle-models')
@UseGuards(JwtAuthGuard)
export class MotocycleModelsController {
  constructor(
    private readonly createMotocycleModelUseCase: CreateMotocycleModelUseCase,
    private readonly updateMotocycleModelUseCase: UpdateMotocycleModelUseCase,
    private readonly deleteMotocycleModelUseCase: DeleteMotocycleModelUseCase,
    private readonly findMotocycleModelByIdUseCase: FindMotocycleModelByIdUseCase,
    private readonly findAllMotocycleModelsUseCase: FindAllMotocycleModelsUseCase,
    private readonly findMotocycleModelsByManufacturerUseCase: FindMotocycleModelsByManufacturerUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateMotocycleModelDto,
  ): Promise<MotocycleModelResponseDto> {
    const model = await this.createMotocycleModelUseCase.execute(dto);
    return this.mapToResponse(model);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<MotocycleModelResponseDto[]> {
    const models = await this.findAllMotocycleModelsUseCase.execute();
    return models.map((model) => this.mapToResponse(model));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string): Promise<MotocycleModelResponseDto> {
    const model = await this.findMotocycleModelByIdUseCase.execute(id);
    return this.mapToResponse(model);
  }

  @Get('manufacturer/:manufacturerId')
  @HttpCode(HttpStatus.OK)
  async findByManufacturer(
    @Param('manufacturerId') manufacturerId: string,
  ): Promise<MotocycleModelResponseDto[]> {
    const models =
      await this.findMotocycleModelsByManufacturerUseCase.execute(
        manufacturerId,
      );
    return models.map((model) => this.mapToResponse(model));
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMotocycleModelDto,
  ): Promise<MotocycleModelResponseDto> {
    const model = await this.updateMotocycleModelUseCase.execute(id, dto);
    return this.mapToResponse(model);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteMotocycleModelUseCase.execute(id);
  }

  private mapToResponse(model: MotocycleModel): MotocycleModelResponseDto {
    return new MotocycleModelResponseDto(
      model.getId().getValue(),
      model.getManufacturerId().getValue(),
      model.getName().getValue(),
      model.getYearStart(),
      model.getYearEnd(),
      model.getDisplacementCc(),
      model.getEngineCycle().getValue(),
      model.getEngineType(),
      model.getValvesPerCylinder(),
      model.getCoolingSystem().getValue(),
      model.getFuelSystem(),
      model.getSparkPlugDefault(),
      model.getBatteryDefault(),
      model.getFinalDrive(),
      model.getGears(),
      model.getClutchType(),
      model.getEngineOilCapacityL(),
      model.getRecommendedOilViscosity(),
      model.getRecommendedOilSpec(),
      model.getFuelTankCapacityL(),
      model.getCoolantCapacityL(),
    );
  }
}
