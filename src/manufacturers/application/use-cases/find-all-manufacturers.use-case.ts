import { Inject, Injectable } from '@nestjs/common';
import {
  MANUFACTURER_REPOSITORY,
  ManufacturerRepositoryPort,
} from '../ports/manufacturer.repository.port';
import { Manufacturer } from '../../domain/entities/manufacturer.entity';

@Injectable()
export class FindAllManufacturersUseCase {
  constructor(
    @Inject(MANUFACTURER_REPOSITORY)
    private readonly manufacturerRepository: ManufacturerRepositoryPort,
  ) {}

  async execute(): Promise<Manufacturer[]> {
    return this.manufacturerRepository.findAll();
  }
}
