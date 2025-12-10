import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ride } from '../../domain/entities/ride.entity';
import { RideRepositoryPort } from '../../application/ports/ride.repository.port';
import { RideSchema } from '../persistence/ride.schema';
import { FuelConsumed } from '../../domain/value-objects/fuel-consumed.vo';
import { RideStatus } from '../../domain/enums/ride-status.enum';

@Injectable()
export class TypeOrmRideRepository implements RideRepositoryPort {
  constructor(
    @InjectRepository(RideSchema)
    private readonly repository: Repository<RideSchema>,
  ) {}

  async save(ride: Ride): Promise<Ride> {
    const schema = this.toPersistence(ride);
    const saved = await this.repository.save(schema);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Ride | null> {
    const schema = await this.repository.findOne({ where: { id } });
    if (!schema) {
      return null;
    }
    return this.toDomain(schema);
  }

  async findByUserMotocycleId(userMotocycleId: string): Promise<Ride[]> {
    const schemas = await this.repository.find({
      where: { userMotocycleId },
    });
    return schemas.map((schema) => this.toDomain(schema));
  }

  async findAll(): Promise<Ride[]> {
    const schemas = await this.repository.find();
    return schemas.map((schema) => this.toDomain(schema));
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(schema: RideSchema): Ride {
    const fuelConsumed = schema.fuelConsumed
      ? new FuelConsumed(schema.fuelConsumed)
      : undefined;

    return Ride.reconstitute(
      schema.id,
      schema.userMotocycleId,
      schema.startDate,
      schema.startOdometer,
      schema.endDate,
      schema.endOdometer,
      fuelConsumed,
      schema.notes,
      schema.status as RideStatus,
      schema.createdAt,
      schema.updatedAt,
    );
  }

  private toPersistence(ride: Ride): RideSchema {
    const schema = new RideSchema();
    schema.id = ride.getId().getValue();
    schema.userMotocycleId = ride.getUserMotocycleId().getValue();
    schema.startDate = ride.getStartDate();
    schema.endDate = ride.getEndDate();
    schema.startOdometer = ride.getStartOdometer();
    schema.endOdometer = ride.getEndOdometer();
    schema.status = ride.getStatus();
    schema.notes = ride.getNotes();

    if (ride.getFuelConsumed()) {
      schema.fuelConsumed = ride.getFuelConsumed()?.getLiters();
    }

    schema.createdAt = ride.getCreatedAt();
    schema.updatedAt = ride.getUpdatedAt();

    return schema;
  }
}
