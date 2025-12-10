import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { UserModule } from './user/user.module';
import { ManufacturersModule } from './manufacturers/manufacturers.module';
import { MotocycleModelsModule } from './motocycle-model/motocycle-models.module';
import { AuthModule } from './auth/auth.module';
import { UserMotocycleModule } from './user-motocycle/user-motocycle.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { RideModule } from './ride/ride.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    ManufacturersModule,
    MotocycleModelsModule,
    UserMotocycleModule,
    MaintenanceModule,
    RideModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
