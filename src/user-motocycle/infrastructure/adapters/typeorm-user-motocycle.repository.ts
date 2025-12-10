import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserMotocycleRepositoryPort } from '../../application/ports/user-motocycle.repository.port';
import { UserMotocycle } from '../../domain/entities/user-motocycle.entity';
import { UserMotocycleSchema } from '../persistence/user-motocycle.schema';

@Injectable()
export class TypeOrmUserMotocycleRepository
  implements UserMotocycleRepositoryPort
{
  constructor(
    @InjectRepository(UserMotocycleSchema)
    private readonly repository: Repository<UserMotocycleSchema>,
  ) {}

  async save(userMotocycle: UserMotocycle): Promise<UserMotocycle> {
    const schema = this.toSchema(userMotocycle);
    await this.repository.save(schema);
    return userMotocycle;
  }

  async findById(id: string): Promise<UserMotocycle | null> {
    const schema = await this.repository.findOne({ where: { id } });
    return schema ? this.toDomain(schema) : null;
  }

  async findByUserId(userId: string): Promise<UserMotocycle[]> {
    const schemas = await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return schemas.map((schema) => this.toDomain(schema));
  }

  async findAll(): Promise<UserMotocycle[]> {
    const schemas = await this.repository.find({
      order: { createdAt: 'DESC' },
    });
    return schemas.map((schema) => this.toDomain(schema));
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete({ id });
  }

  private toSchema(userMotocycle: UserMotocycle): UserMotocycleSchema {
    const schema = new UserMotocycleSchema();
    schema.id = userMotocycle.getId().getValue();
    schema.userId = userMotocycle.getUserId().getValue();
    schema.motocycleModelId = userMotocycle.getMotocycleModelId().getValue();
    schema.nickname = userMotocycle.getNickname().getValue();
    schema.manufacturingYear = userMotocycle.getManufacturingYear().getValue();
    schema.currentOdometer = userMotocycle.getCurrentOdometer().getValue();
    schema.createdAt = userMotocycle.getCreatedAt();
    schema.updatedAt = userMotocycle.getUpdatedAt();
    schema.specificationsOverride =
      userMotocycle.getSpecificationsOverride() || null;
    return schema;
  }

  private toDomain(schema: UserMotocycleSchema): UserMotocycle {
    return UserMotocycle.reconstitute(
      schema.id,
      schema.userId,
      schema.motocycleModelId,
      schema.nickname,
      schema.manufacturingYear,
      schema.currentOdometer,
      schema.createdAt,
      schema.updatedAt,
      schema.specificationsOverride,
    );
  }
}
