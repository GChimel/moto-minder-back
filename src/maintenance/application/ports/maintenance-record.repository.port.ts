import { MaintenanceRecord } from '../../domain/entities/maintenance-record.entity';

export const MAINTENANCE_RECORD_REPOSITORY =
  'MAINTENANCE_RECORD_REPOSITORY';

export interface MaintenanceRecordRepositoryPort {
  save(record: MaintenanceRecord): Promise<MaintenanceRecord>;
  findById(id: string): Promise<MaintenanceRecord | null>;
  findByUserMotocycleId(userMotocycleId: string): Promise<MaintenanceRecord[]>;
  findAll(): Promise<MaintenanceRecord[]>;
  delete(id: string): Promise<void>;
}
