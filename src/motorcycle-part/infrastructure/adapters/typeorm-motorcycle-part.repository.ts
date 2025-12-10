import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MotorcyclePartRepositoryPort } from '../../application/ports/motorcycle-part.repository.port';
import { MotorcyclePart } from '../../domain/entities/motorcycle-part.entity';
import { MotorcyclePartSchema } from '../persistence/motorcycle-part.schema';
import { PartType } from '../../domain/enums/part-type.enum';
import { PartCategory } from '../../domain/enums/part-category.enum';

@Injectable()
export class TypeOrmMotorcyclePartRepository
  implements MotorcyclePartRepositoryPort
{
  constructor(
    @InjectRepository(MotorcyclePartSchema)
    private readonly repository: Repository<MotorcyclePartSchema>,
  ) {}

  async save(part: MotorcyclePart): Promise<MotorcyclePart> {
    const schema = this.toSchema(part);
    await this.repository.save(schema);
    return part;
  }

  async findById(id: string): Promise<MotorcyclePart | null> {
    const schema = await this.repository.findOne({ where: { id } });
    return schema ? this.toDomain(schema) : null;
  }

  async findByUserMotocycleId(
    userMotocycleId: string,
  ): Promise<MotorcyclePart[]> {
    const schemas = await this.repository.find({
      where: { userMotocycleId },
      order: { createdAt: 'DESC' },
    });
    return schemas.map((schema) => this.toDomain(schema));
  }

  async findActiveByUserMotocycleId(
    userMotocycleId: string,
  ): Promise<MotorcyclePart[]> {
    const schemas = await this.repository.find({
      where: { userMotocycleId, isActive: true },
      order: { partType: 'ASC' },
    });
    return schemas.map((schema) => this.toDomain(schema));
  }

  async findByPartType(
    userMotocycleId: string,
    partType: PartType,
  ): Promise<MotorcyclePart[]> {
    const schemas = await this.repository.find({
      where: { userMotocycleId, partType },
      order: { createdAt: 'DESC' },
    });
    return schemas.map((schema) => this.toDomain(schema));
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete({ id });
  }

  private toSchema(part: MotorcyclePart): MotorcyclePartSchema {
    const schema = new MotorcyclePartSchema();
    schema.id = part.getId().getValue();
    schema.userMotocycleId = part.getUserMotocycleId().getValue();
    schema.partType = part.getPartType();
    schema.partCategory = part.getPartCategory();
    schema.name = part.getName();
    schema.manufacturer = part.getManufacturer();
    schema.model = part.getModel();
    schema.installationDate = part.getInstallationDate();
    schema.installationOdometer = part.getInstallationOdometer().getValue();
    schema.expectedLifespanKm = part.getExpectedLifespanKm()?.getLifespanKm();
    schema.expectedLifespanMonths = part
      .getExpectedLifespanKm()
      ?.getLifespanMonths();
    schema.wearRatePerKm = part.getWearRatePerKm()?.getValue();
    schema.replacementThreshold = part.getReplacementThreshold();
    schema.notes = part.getNotes();
    schema.isActive = part.getIsActive();
    schema.createdAt = part.getCreatedAt();
    schema.updatedAt = part.getUpdatedAt();
    return schema;
  }

  private toDomain(schema: MotorcyclePartSchema): MotorcyclePart {
    return MotorcyclePart.reconstitute(
      schema.id,
      schema.userMotocycleId,
      schema.partType as PartType,
      schema.partCategory as PartCategory,
      schema.name,
      schema.manufacturer,
      schema.model,
      schema.installationDate,
      schema.installationOdometer,
      schema.expectedLifespanKm,
      schema.expectedLifespanMonths,
      schema.wearRatePerKm ? Number(schema.wearRatePerKm) : undefined,
      schema.replacementThreshold,
      schema.notes,
      schema.isActive,
      schema.createdAt,
      schema.updatedAt,
    );
  }
}
