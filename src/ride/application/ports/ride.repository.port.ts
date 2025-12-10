import { Ride } from '../../domain/entities/ride.entity';

export const RIDE_REPOSITORY = 'RIDE_REPOSITORY';

export interface RideRepositoryPort {
  save(ride: Ride): Promise<Ride>;
  findById(id: string): Promise<Ride | null>;
  findByUserMotocycleId(userMotocycleId: string): Promise<Ride[]>;
  findAll(): Promise<Ride[]>;
  delete(id: string): Promise<void>;
}
