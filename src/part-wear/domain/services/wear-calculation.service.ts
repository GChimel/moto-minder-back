import { WearPercentage } from '../value-objects/wear-percentage.vo';
import { Odometer } from '../../../shared/domain/value-objects/odometer.vo';
import { MotorcyclePart } from '../../../motorcycle-part/domain/entities/motorcycle-part.entity';

export interface WearCalculationResult {
  wearPercentage: WearPercentage;
  kilometersUsed: number;
  projectedReplacementKm: number;
  isMaintenanceDue: boolean;
  projectedReplacementDate?: Date;
}

export class WearCalculationService {
  calculateWear(
    part: MotorcyclePart,
    currentOdometer: Odometer,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _currentDate: Date = new Date(),
  ): WearCalculationResult {
    const currentKm = currentOdometer.getValue();
    const installationKm = part.getInstallationOdometer().getValue();

    const kilometersUsed = Math.max(0, currentKm - installationKm);

    let wearPercentage: WearPercentage;

    if (part.getWearRatePerKm()) {
      wearPercentage = this.calculateWearByRate(
        part.getWearRatePerKm()!.getValue(),
        kilometersUsed,
      );
    } else if (part.getExpectedLifespanKm()) {
      const lifespanKm = part.getExpectedLifespanKm()!.getKm();
      if (lifespanKm !== undefined) {
        wearPercentage = this.calculateWearByLifespan(
          kilometersUsed,
          lifespanKm,
        );
      } else {
        wearPercentage = WearPercentage.zero();
      }
    } else {
      wearPercentage = WearPercentage.zero();
    }

    const projectedReplacementKm = this.calculateProjectedReplacementKm(
      part,
      kilometersUsed,
      wearPercentage,
    );

    const projectedReplacementDate =
      this.calculateProjectedReplacementDate(part);

    const replacementThreshold = part.getReplacementThreshold();
    const isMaintenanceDue =
      wearPercentage.isMaintenanceDue(replacementThreshold);

    return {
      wearPercentage,
      kilometersUsed,
      projectedReplacementKm,
      isMaintenanceDue,
      projectedReplacementDate,
    };
  }

  private calculateWearByRate(
    wearRatePerKm: number,
    kilometersUsed: number,
  ): WearPercentage {
    const wearPercentageValue = Math.min(
      100,
      kilometersUsed * wearRatePerKm * 100,
    );
    return WearPercentage.create(wearPercentageValue);
  }

  private calculateWearByLifespan(
    kilometersUsed: number,
    expectedLifespanKm: number,
  ): WearPercentage {
    if (expectedLifespanKm <= 0) {
      return WearPercentage.zero();
    }
    const wearPercentageValue = Math.min(
      100,
      (kilometersUsed / expectedLifespanKm) * 100,
    );
    return WearPercentage.create(wearPercentageValue);
  }

  private calculateProjectedReplacementKm(
    part: MotorcyclePart,
    kilometersUsed: number,
    currentWear: WearPercentage,
  ): number {
    if (currentWear.getValue() === 0) {
      if (
        part.getExpectedLifespanKm() &&
        part.getExpectedLifespanKm()!.getKm()
      ) {
        return (
          part.getInstallationOdometer().getValue() +
          part.getExpectedLifespanKm()!.getKm()!
        );
      }
      return 0;
    }

    if (part.getWearRatePerKm()) {
      const wearRatePerKm = part.getWearRatePerKm()!.getValue();
      if (wearRatePerKm > 0) {
        const totalKmForFullWear = 100 / (wearRatePerKm * 100);
        return part.getInstallationOdometer().getValue() + totalKmForFullWear;
      }
    }

    if (part.getExpectedLifespanKm() && part.getExpectedLifespanKm()!.getKm()) {
      return (
        part.getInstallationOdometer().getValue() +
        part.getExpectedLifespanKm()!.getKm()!
      );
    }

    return 0;
  }

  private calculateProjectedReplacementDate(
    part: MotorcyclePart,
  ): Date | undefined {
    if (part.getExpectedLifespanKm()) {
      const lifespan = part.getExpectedLifespanKm()!.getMonths();
      if (lifespan) {
        const installationDate = part.getInstallationDate();
        const projectedDate = new Date(installationDate);
        projectedDate.setMonth(projectedDate.getMonth() + lifespan);
        return projectedDate;
      }
    }

    return undefined;
  }
}
