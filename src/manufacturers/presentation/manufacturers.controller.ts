import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CreateManufacturerUseCase } from '../application/use-cases/create-manufacturer.use-case';
import { FindAllManufacturersUseCase } from '../application/use-cases/find-all-manufacturers.use-case';
import { FindManufacturerByIdUseCase } from '../application/use-cases/find-manufacturer-by-id.use-case';
import { FindManufacturerByNameUseCase } from '../application/use-cases/find-manufacturer-by-name.use-case';
import { CreateManufacturerDto } from './dtos/create-manufacturer.dto';
import { ManufacturerResponseDto } from './dtos/manufacturer-response.dto';
import { Manufacturer } from '../domain/entities/manufacturer.entity';

@Controller('manufacturers')
export class ManufacturersController {
  constructor(
    private readonly createManufacturerUseCase: CreateManufacturerUseCase,
    private readonly findAllManufacturersUseCase: FindAllManufacturersUseCase,
    private readonly findManufacturerByIdUseCase: FindManufacturerByIdUseCase,
    private readonly findManufacturerByNameUseCase: FindManufacturerByNameUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createManufacturer(
    @Body() dto: CreateManufacturerDto,
  ): Promise<ManufacturerResponseDto> {
    const manufacturer = await this.createManufacturerUseCase.execute(dto);
    return this.mapToResponse(manufacturer);
  }

  @Get()
  async findAll(): Promise<ManufacturerResponseDto[]> {
    const manufacturers = await this.findAllManufacturersUseCase.execute();
    return manufacturers.map((manufacturer) =>
      this.mapToResponse(manufacturer),
    );
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ManufacturerResponseDto> {
    const manufacturer = await this.findManufacturerByIdUseCase.execute(id);
    return this.mapToResponse(manufacturer);
  }

  @Get('name/:name')
  async findByName(
    @Param('name') name: string,
  ): Promise<ManufacturerResponseDto> {
    const manufacturer = await this.findManufacturerByNameUseCase.execute(name);
    return this.mapToResponse(manufacturer);
  }

  private mapToResponse(manufacturer: Manufacturer): ManufacturerResponseDto {
    return new ManufacturerResponseDto(
      manufacturer.getId().getValue(),
      manufacturer.getName(),
    );
  }
}
