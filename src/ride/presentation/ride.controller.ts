import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt.guard';
import { StartRideUseCase } from '../application/use-cases/start-ride.use-case';
import { GetRideUseCase } from '../application/use-cases/get-ride.use-case';
import { CompleteRideUseCase } from '../application/use-cases/complete-ride.use-case';
import { CancelRideUseCase } from '../application/use-cases/cancel-ride.use-case';
import { UpdateRideNotesUseCase } from '../application/use-cases/update-ride-notes.use-case';
import { FindRidesByMotorcycleUseCase } from '../application/use-cases/find-rides-by-motorcycle.use-case';
import { GetRideStatisticsUseCase } from '../application/use-cases/get-ride-statistics.use-case';
import { DeleteRideUseCase } from '../application/use-cases/delete-ride.use-case';
import { ImportStravaRideUseCase } from '../application/use-cases/import-strava-ride.use-case';
import { RideResponseDto } from './dtos/ride-response.dto';
import { StartRideDto } from './dtos/start-ride.dto';
import { CompleteRideDto } from './dtos/complete-ride.dto';
import { UpdateRideNotesDto } from './dtos/update-ride-notes.dto';
import { ImportStravaRideDto } from './dtos/import-strava-ride.dto';
import {
  RideNotFoundException,
  InvalidRideStateException,
} from '../domain/exceptions/ride-exceptions';
import { RideStatisticsResponseDto } from './dtos/ride-statistics-response.dto';

@Controller('rides')
@UseGuards(JwtAuthGuard)
export class RideController {
  constructor(
    private readonly startRideUseCase: StartRideUseCase,
    private readonly getRideUseCase: GetRideUseCase,
    private readonly completeRideUseCase: CompleteRideUseCase,
    private readonly cancelRideUseCase: CancelRideUseCase,
    private readonly updateRideNotesUseCase: UpdateRideNotesUseCase,
    private readonly findRidesByMotorcycleUseCase: FindRidesByMotorcycleUseCase,
    private readonly getRideStatisticsUseCase: GetRideStatisticsUseCase,
    private readonly deleteRideUseCase: DeleteRideUseCase,
    private readonly importStravaRideUseCase: ImportStravaRideUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async startRide(@Body() dto: StartRideDto): Promise<RideResponseDto> {
    try {
      const ride = await this.startRideUseCase.execute(dto);
      return new RideResponseDto(ride);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to start ride',
      );
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getRide(@Param('id') rideId: string): Promise<RideResponseDto> {
    const ride = await this.getRideUseCase.execute(rideId);

    if (!ride) {
      throw new NotFoundException(`Ride with id ${rideId} not found`);
    }

    return new RideResponseDto(ride);
  }

  @Get('motorcycle/:userMotocycleId')
  @HttpCode(HttpStatus.OK)
  async getRidesByMotorcycle(
    @Param('userMotocycleId') userMotocycleId: string,
  ): Promise<RideResponseDto[]> {
    const rides =
      await this.findRidesByMotorcycleUseCase.execute(userMotocycleId);
    return RideResponseDto.mapMultiple(rides);
  }

  @Get('motorcycle/:userMotocycleId/statistics')
  @HttpCode(HttpStatus.OK)
  async getRideStatistics(
    @Param('userMotocycleId') userMotocycleId: string,
  ): Promise<RideStatisticsResponseDto> {
    const statistics =
      await this.getRideStatisticsUseCase.execute(userMotocycleId);
    return new RideStatisticsResponseDto(statistics);
  }

  @Post(':id/complete')
  @HttpCode(HttpStatus.OK)
  async completeRide(
    @Param('id') rideId: string,
    @Body() dto: CompleteRideDto,
  ): Promise<RideResponseDto> {
    try {
      const ride = await this.completeRideUseCase.execute(rideId, dto);
      return new RideResponseDto(ride);
    } catch (error) {
      if (error instanceof RideNotFoundException) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof InvalidRideStateException) {
        throw new UnprocessableEntityException(error.message);
      }
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to complete ride',
      );
    }
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancelRide(@Param('id') rideId: string): Promise<RideResponseDto> {
    try {
      const ride = await this.cancelRideUseCase.execute(rideId);
      return new RideResponseDto(ride);
    } catch (error) {
      if (error instanceof RideNotFoundException) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof InvalidRideStateException) {
        throw new UnprocessableEntityException(error.message);
      }
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to cancel ride',
      );
    }
  }

  @Patch(':id/notes')
  @HttpCode(HttpStatus.OK)
  async updateRideNotes(
    @Param('id') rideId: string,
    @Body() dto: UpdateRideNotesDto,
  ): Promise<RideResponseDto> {
    try {
      const ride = await this.updateRideNotesUseCase.execute(rideId, dto.notes);
      return new RideResponseDto(ride);
    } catch (error) {
      if (error instanceof RideNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to update ride notes',
      );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRide(@Param('id') rideId: string): Promise<void> {
    try {
      await this.deleteRideUseCase.execute(rideId);
    } catch (error) {
      if (error instanceof RideNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to delete ride',
      );
    }
  }

  @Post('import/strava')
  @HttpCode(201)
  async importStravaRide(
    @Body() dto: ImportStravaRideDto,
  ): Promise<RideResponseDto> {
    try {
      const ride = await this.importStravaRideUseCase.execute(dto);
      return new RideResponseDto(ride);
    } catch (error) {
      if (error instanceof InvalidRideStateException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
}
