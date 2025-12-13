import { DomainEvent } from '../../../shared/domain/events/domain-event';

export class MaintenanceThresholdCrossedEvent extends DomainEvent {
  constructor(
    public readonly partWearId: string,
    public readonly motorcyclePartId: string,
    public readonly userMotocycleId: string,
    public readonly wearPercentage: number,
    public readonly replacementThreshold: number,
  ) {
    super();
  }

  getEventName(): string {
    return 'maintenance-threshold.crossed';
  }
}
