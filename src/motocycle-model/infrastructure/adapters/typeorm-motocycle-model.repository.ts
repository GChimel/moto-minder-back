import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MotocycleModelRepositoryPort } from '../../application/ports/motocycle-model.repository.port';
import { MotocycleModel } from '../../domain/entities/motocycle-model.entity';
import { MotocycleModelSchema } from '../persistence/motocycle-model.schema';

@Injectable()
export class TypeOrmMotocycleModelRepository
  implements MotocycleModelRepositoryPort
{
  constructor(
    @InjectRepository(MotocycleModelSchema)
    private readonly repository: Repository<MotocycleModelSchema>,
  ) {}

  async save(motocycleModel: MotocycleModel): Promise<MotocycleModel> {
    const schema = this.toSchema(motocycleModel);
    await this.repository.save(schema);
    return motocycleModel;
  }

  async findAll(): Promise<MotocycleModel[]> {
    const schemas = await this.repository.find();
    return schemas.map((schema) => this.toDomain(schema));
  }

  async findById(id: string): Promise<MotocycleModel | null> {
    const schema = await this.repository.findOne({ where: { id } });
    return schema ? this.toDomain(schema) : null;
  }

  async findByManufacturerId(
    manufacturerId: string,
  ): Promise<MotocycleModel[]> {
    const schemas = await this.repository.find({
      where: { manufacturer_id: manufacturerId },
    });
    return schemas.map((schema) => this.toDomain(schema));
  }

  async findByNameAndManufacturer(
    name: string,
    manufacturerId: string,
  ): Promise<MotocycleModel | null> {
    const schema = await this.repository.findOne({
      where: { name, manufacturer_id: manufacturerId },
    });
    return schema ? this.toDomain(schema) : null;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete({ id });
  }

  private toSchema(model: MotocycleModel): MotocycleModelSchema {
    const schema = new MotocycleModelSchema();
    schema.id = model.getId().getValue();
    schema.manufacturer_id = model.getManufacturerId().getValue();
    schema.name = model.getName().getValue();
    schema.year_start = model.getYearStart();
    schema.year_end = model.getYearEnd();
    schema.displacement_cc = model.getDisplacementCc();
    schema.engine_cycle = model.getEngineCycle().getValue();
    schema.engine_type = model.getEngineType();
    schema.valves_per_cylinder = model.getValvesPerCylinder();
    schema.cooling_system = model.getCoolingSystem().getValue();
    schema.fuel_system = model.getFuelSystem();
    schema.spark_plug_default = model.getSparkPlugDefault();
    schema.baterry_default = model.getBatteryDefault();
    schema.final_drive = model.getFinalDrive();
    schema.gears = model.getGears();
    schema.clutch_type = model.getClutchType();
    schema.engine_oil_capacity_l = model.getEngineOilCapacityL();
    schema.recommended_oil_viscosity = model.getRecommendedOilViscosity();
    schema.recommended_oil_spec = model.getRecommendedOilSpec();
    schema.fuel_tank_capacity_l = model.getFuelTankCapacityL();
    schema.coolant_capacity_l = model.getCoolantCapacityL() ?? undefined;
    return schema;
  }

  private toDomain(schema: MotocycleModelSchema): MotocycleModel {
    return MotocycleModel.reconstitute(
      schema.id,
      schema.manufacturer_id,
      schema.name,
      schema.year_start,
      schema.year_end,
      schema.displacement_cc,
      schema.engine_cycle,
      schema.engine_type,
      schema.valves_per_cylinder,
      schema.cooling_system,
      schema.fuel_system,
      schema.spark_plug_default,
      schema.baterry_default,
      schema.final_drive,
      schema.gears,
      schema.clutch_type,
      schema.engine_oil_capacity_l,
      schema.recommended_oil_viscosity,
      schema.recommended_oil_spec,
      schema.fuel_tank_capacity_l,
      schema.coolant_capacity_l,
    );
  }
}
