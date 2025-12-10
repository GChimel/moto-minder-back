export class MotorcyclePartResponseDto {
  id: string;
  userMotocycleId: string;
  partType: string;
  partCategory: string;
  name: string;
  manufacturer?: string;
  model?: string;
  installationDate: string;
  installationOdometer: number;
  expectedLifespanKm?: number;
  expectedLifespanMonths?: number;
  wearRatePerKm?: number;
  replacementThreshold: number;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  constructor(
    id: string,
    userMotocycleId: string,
    partType: string,
    partCategory: string,
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
  ) {
    this.id = id;
    this.userMotocycleId = userMotocycleId;
    this.partType = partType;
    this.partCategory = partCategory;
    this.name = name;
    this.manufacturer = manufacturer;
    this.model = model;
    this.installationDate = installationDate.toISOString();
    this.installationOdometer = installationOdometer;
    this.expectedLifespanKm = expectedLifespanKm;
    this.expectedLifespanMonths = expectedLifespanMonths;
    this.wearRatePerKm = wearRatePerKm;
    this.replacementThreshold = replacementThreshold;
    this.notes = notes;
    this.isActive = isActive;
    this.createdAt = createdAt.toISOString();
    this.updatedAt = updatedAt.toISOString();
  }
}
