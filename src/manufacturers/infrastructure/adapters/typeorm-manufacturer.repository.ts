import { Injectable } from '@nestjs/common';
import { ManufacturerRepositoryPort } from '../../application/ports/manufacturer.repository.port';
import { InjectRepository } from '@nestjs/typeorm';
import { ManufacturerSchema } from '../persistence/manufacturer.schema';
import { Repository } from 'typeorm';
import { Manufacturer } from '../../domain/entities/manufacturer.entity';

@Injectable()
export class TypeOrmManufacturerRepository implements ManufacturerRepositoryPort {
  constructor(
    @InjectRepository(ManufacturerSchema)
    private readonly repository: Repository<ManufacturerSchema>,
  ) {}

  async save(manufacturer: Manufacturer): Promise<Manufacturer> {
    const schema = this.toSchema(manufacturer);
    await this.repository.save(schema);
    return manufacturer;
  }

  async findAll(): Promise<Manufacturer[]> {
    const schemas = await this.repository.find();
    return schemas.map((schema) => this.toDomain(schema));
  }

  async findById(id: string): Promise<Manufacturer | null> {
    const schema = await this.repository.findOne({ where: { id } });
    return schema ? this.toDomain(schema) : null;
  }

  async findByName(name: string): Promise<Manufacturer | null> {
    const schema = await this.repository.findOne({ where: { name } });
    return schema ? this.toDomain(schema) : null;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete({ id });
  }

  private toSchema(manufacturer: Manufacturer): ManufacturerSchema {
    const schema = new ManufacturerSchema();
    schema.id = manufacturer.getId().getValue();
    schema.name = manufacturer.getName();
    return schema;
  }

  private toDomain(schema: ManufacturerSchema): Manufacturer {
    return Manufacturer.reconstitute(schema.id, schema.name);
  }
}
