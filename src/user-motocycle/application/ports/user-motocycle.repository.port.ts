import { UserMotocycle } from '../../domain/entities/user-motocycle.entity';

export const USER_MOTOCYCLE_REPOSITORY = 'USER_MOTOCYCLE_REPOSITORY';

export interface UserMotocycleRepositoryPort {
  save(userMotocycle: UserMotocycle): Promise<UserMotocycle>;
  findById(id: string): Promise<UserMotocycle | null>;
  findByUserId(userId: string): Promise<UserMotocycle[]>;
  findAll(): Promise<UserMotocycle[]>;
  delete(id: string): Promise<void>;
}
