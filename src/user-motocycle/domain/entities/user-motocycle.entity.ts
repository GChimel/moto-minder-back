import { IMotocycleModel } from '../../../motocycle-model/domain/entities/motocycle-model.entity';
import { IdVO } from '../../../shared/infrastructure/domain/value-objects/id-vo';
import { Nickname } from '../../../shared/domain/value-objects/nickname.vo';
import { Odometer } from '../../../shared/domain/value-objects/odometer.vo';
import { Year } from '../../../shared/domain/value-objects/year.vo';
import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';

interface IUserMotocycleModel {
  userId: string;
  motocycleModelId: string;
  nickname: string;
  manufacturingYear: number;
  currentOdometer: number;
}

export class UserMotocycle {
  constructor(
    private readonly id: IdVO,
    private readonly userId: IdVO,
    private readonly motocycleModelId: IdVO,
    private nickname: Nickname,
    private manufacturingYear: Year,
    private currentOdometer: Odometer,
    private readonly createdAt: Date,
    private updatedAt: Date,
    private specificationsOverride?: Partial<IMotocycleModel> | null,
  ) {}

  static create(body: IUserMotocycleModel): UserMotocycle {
    const nickname = new Nickname(body.nickname);
    const manufacturingYear = new Year(body.manufacturingYear);
    const currentOdometer = new Odometer(body.currentOdometer);

    return new UserMotocycle(
      new IdVO(),
      new IdVO(body.userId),
      new IdVO(body.motocycleModelId),
      nickname,
      manufacturingYear,
      currentOdometer,
      new Date(),
      new Date(),
      null,
    );
  }

  static reconstitute(
    id: string,
    userId: string,
    motocycleModelId: string,
    nickname: string,
    manufacturingYear: number,
    currentOdometer: number,
    createdAt: Date,
    updatedAt: Date,
    specificationsOverride?: Partial<IMotocycleModel> | null,
  ): UserMotocycle {
    return new UserMotocycle(
      new IdVO(id),
      new IdVO(userId),
      new IdVO(motocycleModelId),
      new Nickname(nickname),
      new Year(manufacturingYear),
      new Odometer(currentOdometer),
      createdAt,
      updatedAt,
      specificationsOverride,
    );
  }

  getId(): IdVO {
    return this.id;
  }

  getUserId(): IdVO {
    return this.userId;
  }

  getMotocycleModelId(): IdVO {
    return this.motocycleModelId;
  }

  getNickname(): Nickname {
    return this.nickname;
  }

  getManufacturingYear(): Year {
    return this.manufacturingYear;
  }

  getCurrentOdometer(): Odometer {
    return this.currentOdometer;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getSpecificationsOverride(): Partial<IMotocycleModel> | null | undefined {
    return this.specificationsOverride;
  }

  updateNickname(nickname: string): void {
    this.nickname = new Nickname(nickname);
    this.updatedAt = new Date();
  }

  updateManufacturingYear(year: number): void {
    this.manufacturingYear = new Year(year);
    this.updatedAt = new Date();
  }

  updateOdometer(odometer: number): void {
    const newOdometer = new Odometer(odometer);

    if (newOdometer.isLessThan(this.currentOdometer)) {
      throw new InvalidArgumentException(
        'odometer',
        'Odometer cannot decrease. Current odometer: ' +
          this.currentOdometer.getValue(),
      );
    }

    this.currentOdometer = newOdometer;
    this.updatedAt = new Date();
  }
}
