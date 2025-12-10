import { IdVO } from '../../../shared/infrastructure/domain/value-objects/id-vo';
import { Odometer } from '../../../shared/domain/value-objects/odometer.vo';
import { PartType } from '../enums/part-type.enum';
import { PartCategory } from '../enums/part-category.enum';
import { PartLifespan } from '../value-objects/part-lifespan.vo';
import { WearRate } from '../value-objects/wear-rate.vo';
import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';

export interface CreateMotorcyclePartDto {
  userMotocycleId: string;
  partType: PartType;
  partCategory: PartCategory;
  name: string;
  manufacturer?: string;
  model?: string;
  installationDate: Date;
  installationOdometer: number;
  expectedLifespanKm?: number;
  expectedLifespanMonths?: number;
  wearRatePerKm?: number;
  replacementThreshold?: number;
  notes?: string;
}

export class MotorcyclePart {
  private readonly id: IdVO;
  private readonly userMotocycleId: IdVO;
  private readonly partType: PartType;
  private readonly partCategory: PartCategory;
  private readonly name: string;
  private readonly manufacturer?: string;
  private readonly model?: string;
  private readonly installationDate: Date;
  private readonly installationOdometer: Odometer;
  private expectedLifespanKm?: PartLifespan;
  private readonly wearRatePerKm?: WearRate;
  private readonly replacementThreshold: number;
  private notes?: string;
  private isActive: boolean;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(
    id: IdVO,
    userMotocycleId: IdVO,
    partType: PartType,
    partCategory: PartCategory,
    name: string,
    manufacturer: string | undefined,
    model: string | undefined,
    installationDate: Date,
    installationOdometer: Odometer,
    expectedLifespanKm: PartLifespan | undefined,
    wearRatePerKm: WearRate | undefined,
    replacementThreshold: number,
    notes: string | undefined,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.validateName(name);
    this.validateReplacementThreshold(replacementThreshold);
    this.validateInstallationDate(installationDate);

    this.id = id;
    this.userMotocycleId = userMotocycleId;
    this.partType = partType;
    this.partCategory = partCategory;
    this.name = name;
    this.manufacturer = manufacturer;
    this.model = model;
    this.installationDate = installationDate;
    this.installationOdometer = installationOdometer;
    this.expectedLifespanKm = expectedLifespanKm;
    this.wearRatePerKm = wearRatePerKm;
    this.replacementThreshold = replacementThreshold;
    this.notes = notes;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(dto: CreateMotorcyclePartDto): MotorcyclePart {
    const id = new IdVO();
    const userMotocycleId = new IdVO(dto.userMotocycleId);
    const installationOdometer = new Odometer(dto.installationOdometer);

    let expectedLifespanKm: PartLifespan | undefined;
    if (dto.expectedLifespanKm || dto.expectedLifespanMonths) {
      expectedLifespanKm = new PartLifespan({
        lifespanKm: dto.expectedLifespanKm,
        lifespanMonths: dto.expectedLifespanMonths,
      });
    }

    const wearRatePerKm = dto.wearRatePerKm
      ? new WearRate(dto.wearRatePerKm)
      : undefined;

    const replacementThreshold = dto.replacementThreshold ?? 70;

    return new MotorcyclePart(
      id,
      userMotocycleId,
      dto.partType,
      dto.partCategory,
      dto.name,
      dto.manufacturer,
      dto.model,
      dto.installationDate,
      installationOdometer,
      expectedLifespanKm,
      wearRatePerKm,
      replacementThreshold,
      dto.notes,
      true,
      new Date(),
      new Date(),
    );
  }

  static reconstitute(
    id: string,
    userMotocycleId: string,
    partType: PartType,
    partCategory: PartCategory,
    name: string,
    manufacturer: string | undefined,
    model: string | undefined,
    installationDate: Date,
    installationOdometer: number,
    expectedLifespanKm: number | undefined,
    expectedLifespanMonths: number | undefined,
    wearRatePerKm: number | undefined,
    replacementThreshold: number,
    notes: string | undefined,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
  ): MotorcyclePart {
    const idVO = new IdVO(id);
    const userMotocycleIdVO = new IdVO(userMotocycleId);
    const installationOdometerVO = new Odometer(installationOdometer);

    let expectedLifespanVO: PartLifespan | undefined;
    if (expectedLifespanKm || expectedLifespanMonths) {
      expectedLifespanVO = new PartLifespan({
        lifespanKm: expectedLifespanKm,
        lifespanMonths: expectedLifespanMonths,
      });
    }

    const wearRateVO = wearRatePerKm ? new WearRate(wearRatePerKm) : undefined;

    return new MotorcyclePart(
      idVO,
      userMotocycleIdVO,
      partType,
      partCategory,
      name,
      manufacturer,
      model,
      installationDate,
      installationOdometerVO,
      expectedLifespanVO,
      wearRateVO,
      replacementThreshold,
      notes,
      isActive,
      createdAt,
      updatedAt,
    );
  }

  markAsReplaced(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  updateNotes(notes: string | undefined): void {
    this.notes = notes;
    this.updatedAt = new Date();
  }

  updateExpectedLifespan(lifespan: PartLifespan): void {
    this.expectedLifespanKm = lifespan;
    this.updatedAt = new Date();
  }

  getId(): IdVO {
    return this.id;
  }

  getUserMotocycleId(): IdVO {
    return this.userMotocycleId;
  }

  getPartType(): PartType {
    return this.partType;
  }

  getPartCategory(): PartCategory {
    return this.partCategory;
  }

  getName(): string {
    return this.name;
  }

  getManufacturer(): string | undefined {
    return this.manufacturer;
  }

  getModel(): string | undefined {
    return this.model;
  }

  getInstallationDate(): Date {
    return this.installationDate;
  }

  getInstallationOdometer(): Odometer {
    return this.installationOdometer;
  }

  getExpectedLifespanKm(): PartLifespan | undefined {
    return this.expectedLifespanKm;
  }

  getWearRatePerKm(): WearRate | undefined {
    return this.wearRatePerKm;
  }

  getReplacementThreshold(): number {
    return this.replacementThreshold;
  }

  getNotes(): string | undefined {
    return this.notes;
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  private validateName(name: string): void {
    if (!name || name.trim() === '') {
      throw new InvalidArgumentException('name', 'Part name cannot be empty');
    }
    if (name.length > 200) {
      throw new InvalidArgumentException(
        'name',
        'Part name cannot exceed 200 characters',
      );
    }
  }

  private validateReplacementThreshold(threshold: number): void {
    if (threshold < 0 || threshold > 100) {
      throw new InvalidArgumentException(
        'replacementThreshold',
        'Replacement threshold must be between 0 and 100',
      );
    }
  }

  private validateInstallationDate(date: Date): void {
    if (date > new Date()) {
      throw new InvalidArgumentException(
        'installationDate',
        'Installation date cannot be in the future',
      );
    }
  }
}
