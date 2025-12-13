import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Ride } from '../../../ride/domain/entities/ride.entity';
import { RideCompletedEvent } from '../../../ride/domain/events/ride-completed.event';
import { MaintenanceThresholdCrossedEvent } from '../../../part-wear/domain/events/maintenance-threshold-crossed.event';

describe('Event-Driven Integration - Ride Completion Flow', () => {
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventEmitter2],
    }).compile();

    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  describe('RideCompletedEvent', () => {
    it('should emit ride.completed event when ride is completed', () => {
      const eventSpy = jest.fn();
      eventEmitter.on('ride.completed', eventSpy);

      const ride = Ride.create({
        userMotocycleId: 'moto-123',
        startDate: new Date('2024-12-01T08:00:00'),
        startOdometer: 10000,
      });

      ride.completeRide(10100, 5);
      const events = ride.getDomainEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(RideCompletedEvent);
      expect(events[0].getEventName()).toBe('ride.completed');

      const event = events[0] as RideCompletedEvent;
      expect(event.endOdometer).toBe(10100);
      expect(event.userMotocycleId).toBe('moto-123');
    });

    it('should contain correct event data', () => {
      const ride = Ride.create({
        userMotocycleId: 'moto-456',
        startDate: new Date('2024-12-02T09:00:00'),
        startOdometer: 5000,
      });

      ride.completeRide(5150, 3.5);
      const events = ride.getDomainEvents();
      const event = events[0] as RideCompletedEvent;

      expect(event.rideId).toEqual(ride.getId().getValue());
      expect(event.userMotocycleId).toBe('moto-456');
      expect(event.endOdometer).toBe(5150);
      expect(event.occurredAt).toBeInstanceOf(Date);
    });

    it('should not emit event for cancelled ride', () => {
      const ride = Ride.create({
        userMotocycleId: 'moto-789',
        startDate: new Date('2024-12-03T10:00:00'),
        startOdometer: 20000,
      });

      ride.cancelRide();
      const events = ride.getDomainEvents();

      expect(events).toHaveLength(0);
    });

    it('should clear events after publishing', () => {
      const ride = Ride.create({
        userMotocycleId: 'moto-111',
        startDate: new Date('2024-12-04T11:00:00'),
        startOdometer: 15000,
      });

      ride.completeRide(15100);
      const beforeClear = ride.getDomainEvents();
      expect(beforeClear).toHaveLength(1);

      ride.clearDomainEvents();
      const afterClear = ride.getDomainEvents();
      expect(afterClear).toHaveLength(0);
    });
  });

  describe('MaintenanceThresholdCrossedEvent', () => {
    it('should create event with correct data', () => {
      const event = new MaintenanceThresholdCrossedEvent(
        'wear-123',
        'part-456',
        'moto-789',
        85.5,
        70,
      );

      expect(event.partWearId).toBe('wear-123');
      expect(event.motorcyclePartId).toBe('part-456');
      expect(event.userMotocycleId).toBe('moto-789');
      expect(event.wearPercentage).toBe(85.5);
      expect(event.replacementThreshold).toBe(70);
      expect(event.getEventName()).toBe('maintenance-threshold.crossed');
    });

    it('should have valid event name for routing', () => {
      const event = new MaintenanceThresholdCrossedEvent(
        'wear-id',
        'part-id',
        'moto-id',
        75,
        70,
      );

      expect(event.getEventName()).toBe('maintenance-threshold.crossed');
      expect(typeof event.getEventName()).toBe('string');
      expect(event.getEventName().length).toBeGreaterThan(0);
    });
  });

  describe('Event Listener Registration', () => {
    it('should allow multiple listeners for same event', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      eventEmitter.on('ride.completed', listener1);
      eventEmitter.on('ride.completed', listener2);

      const event = new RideCompletedEvent('ride-123', 'moto-123', 10100);
      eventEmitter.emit('ride.completed', event);

      expect(listener1).toHaveBeenCalledWith(event);
      expect(listener2).toHaveBeenCalledWith(event);
    });

    it('should handle async event listeners', async () => {
      const asyncListener = jest.fn().mockResolvedValue(undefined);

      eventEmitter.on('maintenance-threshold.crossed', asyncListener);

      const event = new MaintenanceThresholdCrossedEvent(
        'wear-123',
        'part-456',
        'moto-789',
        80,
        70,
      );

      await eventEmitter.emitAsync('maintenance-threshold.crossed', event);

      expect(asyncListener).toHaveBeenCalledWith(event);
    });

    it('should support event filtering', () => {
      const listener = jest.fn();

      eventEmitter.on('ride.completed', listener);

      const event1 = new RideCompletedEvent('ride-1', 'moto-1', 10100);
      const event2 = new RideCompletedEvent('ride-2', 'moto-2', 9900);

      eventEmitter.emit('ride.completed', event1);
      eventEmitter.emit('ride.completed', event2);

      expect(listener).toHaveBeenCalledTimes(2);
    });
  });

  describe('Event Propagation Chain', () => {
    it('should support event cascading', async () => {
      const rideListener = jest.fn().mockResolvedValue(undefined);
      const thresholdListener = jest.fn().mockResolvedValue(undefined);

      eventEmitter.on('ride.completed', rideListener);
      eventEmitter.on('maintenance-threshold.crossed', thresholdListener);

      const rideEvent = new RideCompletedEvent('ride-123', 'moto-456', 10200);
      await eventEmitter.emitAsync('ride.completed', rideEvent);

      const thresholdEvent = new MaintenanceThresholdCrossedEvent(
        'wear-123',
        'part-456',
        'moto-456',
        85,
        70,
      );
      await eventEmitter.emitAsync(
        'maintenance-threshold.crossed',
        thresholdEvent,
      );

      expect(rideListener).toHaveBeenCalledWith(rideEvent);
      expect(thresholdListener).toHaveBeenCalledWith(thresholdEvent);
    });

    it('should maintain event ordering', async () => {
      const eventOrder: string[] = [];

      eventEmitter.on('ride.completed', () => {
        eventOrder.push('ride.completed');
      });

      eventEmitter.on('maintenance-threshold.crossed', () => {
        eventOrder.push('maintenance-threshold.crossed');
      });

      const rideEvent = new RideCompletedEvent('ride-123', 'moto-456', 10200);
      await eventEmitter.emitAsync('ride.completed', rideEvent);

      const thresholdEvent = new MaintenanceThresholdCrossedEvent(
        'wear-123',
        'part-456',
        'moto-456',
        85,
        70,
      );
      await eventEmitter.emitAsync(
        'maintenance-threshold.crossed',
        thresholdEvent,
      );

      expect(eventOrder).toEqual([
        'ride.completed',
        'maintenance-threshold.crossed',
      ]);
    });
  });
});
