import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('motocycle_models')
export class MotocycleModelSchema {
  @PrimaryColumn('uuid')
  public id: string;

  @Column('uuid')
  public manufacturer_id: string;

  @Column({ length: 100 })
  public name: string;

  @Column()
  public year_start: number;

  @Column()
  public year_end: number;

  @Column()
  public displacement_cc: number;

  @Column({ length: 100 })
  public engine_type: string;

  @Column({ length: 100 })
  public engine_cycle: string;

  @Column()
  public valves_per_cylinder: number;

  @Column({ length: 20 })
  public cooling_system: string;

  @Column({ length: 30 })
  public fuel_system: string;

  @Column({ length: 50 })
  public spark_plug_default: string;

  @Column({ length: 50 })
  public baterry_default: string;

  @Column({ length: 20 })
  public final_drive: string;

  @Column()
  public gears: number;

  @Column({ length: 50 })
  public clutch_type: string;

  @Column({ type: 'decimal', precision: 4, scale: 2 })
  public engine_oil_capacity_l: number;

  @Column({ length: 20 })
  public recommended_oil_viscosity: string;

  @Column({ length: 50 })
  public recommended_oil_spec: string;

  @Column({ type: 'decimal', precision: 4, scale: 2 })
  public coolant_capacity_l?: number;

  @Column({ type: 'decimal', precision: 4, scale: 2 })
  public fuel_tank_capacity_l: number;
}
