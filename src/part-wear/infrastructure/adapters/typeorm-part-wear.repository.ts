import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartWearRepositoryPort } from '../../application/ports/part-wear.repository.port';
import { PartWear } from '../../domain/entities/part-wear.entity';
import { PartWearSchema } from '../persistence/part-wear.schema';
import { WearPercentage } from '../../domain/value-objects/wear-percentage.vo';
import { IdVO } from '../../../shared/infrastructure/domain/value-objects/id-vo';
import { Odometer } from '../../../shared/domain/value-objects/odometer.vo';
import { MotorcyclePartSchema } from '../../../motorcycle-part/infrastructure/persistence/motorcycle-part.schema';

@Injectable()
export class TypeOrmPartWearRepository implements PartWearRepositoryPort {
  constructor(
    @InjectRepository(PartWearSchema)
    private readonly partWearSchema: Repository<PartWearSchema>,
    @InjectRepository(MotorcyclePartSchema)
    private readonly motorcyclePartSchema: Repository<MotorcyclePartSchema>,
  ) {}

  async save(partWear: PartWear): Promise<PartWear> {
    const schema = this.toSchema(partWear);
    const saved = await this.partWearSchema.save(schema);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<PartWear | null> {
    const schema = await this.partWearSchema.findOne({
      where: { id },
    });
    return schema ? this.toDomain(schema) : null;
  }

  async findByMotorcyclePartId(
    motorcyclePartId: string,
  ): Promise<PartWear | null> {
    const schema = await this.partWearSchema.findOne({
      where: { motorcyclePartId },
    });
    return schema ? this.toDomain(schema) : null;
  }

  async findByUserMotocycleId(userMotocycleId: string): Promise<PartWear[]> {
    const schemas = await this.partWearSchema
      .createQueryBuilder('pw')
      .leftJoinAndSelect('pw.motorcyclePart', 'mp')
      .where('mp.userMotocycleId = :userMotocycleId', { userMotocycleId })
      .orderBy('mp.createdAt', 'DESC')
      .getMany();

    return schemas.map((schema) => this.toDomain(schema));
  }

  async findPartsDueForMaintenance(
    userMotocycleId: string,
  ): Promise<PartWear[]> {
    const schemas = await this.partWearSchema
      .createQueryBuilder('pw')
      .leftJoinAndSelect('pw.motorcyclePart', 'mp')
      .where('mp.userMotocycleId = :userMotocycleId', { userMotocycleId })
      .andWhere('pw.isMaintenanceDue = :isMaintenanceDue', {
        isMaintenanceDue: true,
      })
      .andWhere('mp.isActive = :isActive', { isActive: true })
      .orderBy('pw.currentWearPercentage', 'DESC')
      .getMany();

    return schemas.map((schema) => this.toDomain(schema));
  }

  async delete(id: string): Promise<void> {
    await this.partWearSchema.delete({ id });
  }

  private toSchema(partWear: PartWear): PartWearSchema {
    const schema = new PartWearSchema();
    schema.id = partWear.getId().getValue();
    schema.motorcyclePartId = partWear.getMotorcyclePartId().getValue();
    schema.currentWearPercentage = partWear
      .getCurrentWearPercentage()
      .getValue();
    schema.lastCalculatedAt = partWear.getLastCalculatedAt();
    schema.lastKnownOdometer = partWear.getLastKnownOdometer().getValue();
    schema.projectedReplacementOdometer =
      partWear.getProjectedReplacementOdometer();
    schema.projectedReplacementDate = partWear.getProjectedReplacementDate();
    schema.isMaintenanceDue = partWear.isMaintenanceDueStatus();
    schema.createdAt = partWear.getCreatedAt();
    schema.updatedAt = partWear.getUpdatedAt();
    return schema;
  }

  private toDomain(schema: PartWearSchema): PartWear {
    return PartWear.reconstitute({
      id: IdVO.create(schema.id),
      motorcyclePartId: IdVO.create(schema.motorcyclePartId),
      currentWearPercentage: WearPercentage.create(
        schema.currentWearPercentage,
      ),
      lastCalculatedAt: schema.lastCalculatedAt,
      lastKnownOdometer: Odometer.create(schema.lastKnownOdometer),
      projectedReplacementOdometer: schema.projectedReplacementOdometer,
      projectedReplacementDate: schema.projectedReplacementDate,
      isMaintenanceDue: schema.isMaintenanceDue,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }
}
