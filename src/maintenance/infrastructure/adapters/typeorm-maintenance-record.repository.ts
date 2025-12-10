import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaintenanceRecord } from '../../domain/entities/maintenance-record.entity';
import { MaintenanceRecordRepositoryPort } from '../../application/ports/maintenance-record.repository.port';
import { MaintenanceRecordSchema } from '../persistence/maintenance-record.schema';
import { ServiceInterval } from '../../domain/value-objects/service-interval.vo';

@Injectable()
export class TypeOrmMaintenanceRecordRepository
  implements MaintenanceRecordRepositoryPort
{
  constructor(
    @InjectRepository(MaintenanceRecordSchema)
    private readonly repository: Repository<MaintenanceRecordSchema>,
  ) {}

  async save(record: MaintenanceRecord): Promise<MaintenanceRecord> {
    const schema = this.toPersistence(record);
    const saved = await this.repository.save(schema);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<MaintenanceRecord | null> {
    const schema = await this.repository.findOne({ where: { id } });
    if (!schema) {
      return null;
    }
    return this.toDomain(schema);
  }

  async findByUserMotocycleId(
    userMotocycleId: string,
  ): Promise<MaintenanceRecord[]> {
    const schemas = await this.repository.find({
      where: { userMotocycleId },
    });
    return schemas.map((schema) => this.toDomain(schema));
  }

  async findAll(): Promise<MaintenanceRecord[]> {
    const schemas = await this.repository.find();
    return schemas.map((schema) => this.toDomain(schema));
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(schema: MaintenanceRecordSchema): MaintenanceRecord {
    const nextServiceInterval = schema.nextServiceInterval
      ? new ServiceInterval(schema.nextServiceInterval)
      : undefined;

    return MaintenanceRecord.reconstitute(
      schema.id,
      schema.userMotocycleId,
      schema.serviceType,
      schema.performedAt,
      schema.odometerAtService,
      schema.cost,
      schema.partsUsed,
      schema.notes,
      nextServiceInterval,
      schema.createdAt,
      schema.updatedAt,
    );
  }

  private toPersistence(record: MaintenanceRecord): MaintenanceRecordSchema {
    const schema = new MaintenanceRecordSchema();
    schema.id = record.getId().getValue();
    schema.userMotocycleId = record.getUserMotocycleId().getValue();
    schema.serviceType = record.getServiceType();
    schema.performedAt = record.getPerformedAt();
    schema.odometerAtService = record.getOdometerAtService();
    schema.cost = record.getCost();
    schema.partsUsed = record.getPartsUsed();
    schema.notes = record.getNotes();

    if (record.getNextServiceInterval()) {
      const interval = record.getNextServiceInterval();
      schema.nextServiceInterval = {
        intervalKm: interval?.getIntervalKm(),
        intervalMonths: interval?.getIntervalMonths(),
      };
    }

    schema.createdAt = record.getCreatedAt();
    schema.updatedAt = record.getUpdatedAt();

    return schema;
  }
}
