import { Ride } from '../../domain/entities/ride.entity';

export class RideResponseDto {
  id: string;
  userMotocycleId: string;
  startDate: string;
  endDate?: string;
  startOdometer: number;
  endOdometer?: number;
  fuelConsumed?: number;
  notes?: string;
  status: string;
  distance?: number;
  fuelEconomy?: number;
  duration?: number;
  averageSpeed?: number;
  createdAt: string;
  updatedAt: string;

  constructor(ride: Ride) {
    this.id = ride.getId().getValue();
    this.userMotocycleId = ride.getUserMotocycleId().getValue();
    this.startDate = ride.getStartDate().toISOString();
    this.endDate = ride.getEndDate()?.toISOString();
    this.startOdometer = ride.getStartOdometer();
    this.endOdometer = ride.getEndOdometer();
    this.fuelConsumed = ride.getFuelConsumed()?.getLiters();
    this.notes = ride.getNotes();
    this.status = ride.getStatus();
    this.distance = ride.calculateDistance()?.getKilometers();
    this.fuelEconomy = ride.calculateFuelEconomy();
    this.duration = ride.calculateDuration();
    this.averageSpeed = ride.calculateAverageSpeed();
    this.createdAt = ride.getCreatedAt().toISOString();
    this.updatedAt = ride.getUpdatedAt().toISOString();
  }

  static mapMultiple(rides: Ride[]): RideResponseDto[] {
    return rides.map((ride) => new RideResponseDto(ride));
  }
}
