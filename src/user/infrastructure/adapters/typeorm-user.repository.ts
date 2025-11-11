import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepositoryPort } from '../../application/ports/user.repository.port';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { UserSchema } from '../persistence/user.schema';

@Injectable()
export class TypeOrmUserRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserSchema)
    private readonly repository: Repository<UserSchema>,
  ) {}

  async save(user: User): Promise<User> {
    const schema = this.toSchema(user);
    await this.repository.save(schema);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    const schema = await this.repository.findOne({ where: { id } });
    return schema ? this.toDomain(schema) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const schema = await this.repository.findOne({ where: { email } });
    return schema ? this.toDomain(schema) : null;
  }

  async findAll(): Promise<User[]> {
    const schemas = await this.repository.find();
    return schemas.map((schema) => this.toDomain(schema));
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete({ id });
  }

  private toSchema(user: User): UserSchema {
    const schema = new UserSchema();
    schema.id = user.getId().getValue();
    schema.name = user.getName();
    schema.email = user.getEmail().getValue();
    schema.createdAt = user.getCreatedAt();
    schema.updatedAt = user.getUpdatedAt();
    schema.password = user.getPassword();
    return schema;
  }

  private toDomain(schema: UserSchema): User {
    return new User(
      new UserId(schema.id),
      schema.name,
      new Email(schema.email),
      schema.createdAt,
      schema.updatedAt,
      schema.password,
    );
  }
}
