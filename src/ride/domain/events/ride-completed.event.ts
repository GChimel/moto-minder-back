import { DomainEvent } from '../../../shared/domain/events/domain-event';

export class RideCompletedEvent extends DomainEvent {
  constructor(
    public readonly rideId: string,
    public readonly userMotocycleId: string,
    public readonly endOdometer: number,
  ) {
    super();
  }

  getEventName(): string {
    return 'ride.completed';
  }
}
