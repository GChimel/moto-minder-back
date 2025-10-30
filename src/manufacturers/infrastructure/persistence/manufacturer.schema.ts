import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('manufacturers')
export class ManufacturerSchema {
  @PrimaryColumn('uuid')
  public id: string;

  @Column({ length: 100 })
  public name: string;
}
