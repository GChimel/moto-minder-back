import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateMaintenanceRecordUseCase } from '../application/use-cases/create-maintenance-record.use-case';
import { FindMaintenanceByMotorcycleUseCase } from '../application/use-cases/find-maintenance-by-motorcycle.use-case';
import { FindUpcomingMaintenanceUseCase } from '../application/use-cases/find-upcoming-maintenance.use-case';
import { UpdateMaintenanceRecordUseCase } from '../application/use-cases/update-maintenance-record.use-case';
import { DeleteMaintenanceRecordUseCase } from '../application/use-cases/delete-maintenance-record.use-case';
import { GetMaintenanceHistoryUseCase } from '../application/use-cases/get-maintenance-history.use-case';
import { MaintenanceRecord } from '../domain/entities/maintenance-record.entity';
import { CreateMaintenanceRecordDto } from './dtos/create-maintenance-record.dto';
import { UpdateMaintenanceRecordDto } from './dtos/update-maintenance-record.dto';
import { MaintenanceRecordResponseDto } from './dtos/maintenance-record-response.dto';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt.guard';

@Controller('maintenance')
@UseGuards(JwtAuthGuard)
export class MaintenanceController {
  constructor(
    private readonly createMaintenanceUseCase: CreateMaintenanceRecordUseCase,
    private readonly findByMotorcycleUseCase: FindMaintenanceByMotorcycleUseCase,
    private readonly findUpcomingUseCase: FindUpcomingMaintenanceUseCase,
    private readonly updateMaintenanceUseCase: UpdateMaintenanceRecordUseCase,
    private readonly deleteMaintenanceUseCase: DeleteMaintenanceRecordUseCase,
    private readonly getHistoryUseCase: GetMaintenanceHistoryUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateMaintenanceRecordDto,
  ): Promise<MaintenanceRecordResponseDto> {
    const record = await this.createMaintenanceUseCase.execute(dto);
    return this.mapToResponse(record);
  }

  @Get('motorcycle/:userMotocycleId')
  async findByMotorcycle(
    @Param('userMotocycleId') userMotocycleId: string,
  ): Promise<MaintenanceRecordResponseDto[]> {
    const records = await this.findByMotorcycleUseCase.execute(userMotocycleId);
    return records.map((record) => this.mapToResponse(record));
  }

  @Get('upcoming')
  async findUpcoming(
    @Query('userMotocycleId') userMotocycleId: string,
    @Query('currentOdometer') currentOdometer: string,
  ): Promise<
    Array<{
      record: MaintenanceRecordResponseDto;
      nextServiceDueOdometer?: number;
      nextServiceDueDate?: Date;
      isOverdueByOdometer: boolean;
      isOverdueByDate: boolean;
    }>
  > {
    const upcoming = await this.findUpcomingUseCase.execute(
      userMotocycleId,
      parseInt(currentOdometer, 10),
    );
    return upcoming.map((item) => ({
      record: this.mapToResponse(item.record),
      nextServiceDueOdometer: item.nextServiceDueOdometer,
      nextServiceDueDate: item.nextServiceDueDate,
      isOverdueByOdometer: item.isOverdueByOdometer,
      isOverdueByDate: item.isOverdueByDate,
    }));
  }

  @Get('history/:userMotocycleId')
  async getHistory(
    @Param('userMotocycleId') userMotocycleId: string,
    @Query('skip') skip?: string,
    @Query('limit') limit?: string,
  ): Promise<{
    records: MaintenanceRecordResponseDto[];
    total: number;
    skip: number;
    limit: number;
    hasMore: boolean;
  }> {
    const pagination = {
      skip: skip ? parseInt(skip, 10) : 0,
      limit: limit ? parseInt(limit, 10) : 50,
    };

    const result = await this.getHistoryUseCase.execute(
      userMotocycleId,
      pagination,
    );

    return {
      records: result.records.map((record) => this.mapToResponse(record)),
      total: result.total,
      skip: result.skip,
      limit: result.limit,
      hasMore: result.hasMore,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMaintenanceRecordDto,
  ): Promise<MaintenanceRecordResponseDto> {
    const record = await this.updateMaintenanceUseCase.execute(id, dto);
    return this.mapToResponse(record);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteMaintenanceUseCase.execute(id);
  }

  private mapToResponse(
    record: MaintenanceRecord,
  ): MaintenanceRecordResponseDto {
    const nextServiceInterval = record.getNextServiceInterval();
    return {
      id: record.getId().getValue(),
      userMotocycleId: record.getUserMotocycleId().getValue(),
      serviceType: record.getServiceType(),
      performedAt: record.getPerformedAt(),
      odometerAtService: record.getOdometerAtService(),
      cost: record.getCost(),
      partsUsed: record.getPartsUsed(),
      notes: record.getNotes(),
      nextServiceInterval: nextServiceInterval
        ? {
            intervalKm: nextServiceInterval.getIntervalKm(),
            intervalMonths: nextServiceInterval.getIntervalMonths(),
          }
        : undefined,
      nextServiceDueOdometer: record.calculateNextServiceDueOdometer(),
      nextServiceDueDate: record.calculateNextServiceDueDate(),
      createdAt: record.getCreatedAt(),
      updatedAt: record.getUpdatedAt(),
    };
  }
}
