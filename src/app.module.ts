import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { UserModule } from './user/user.module';
import { ManufacturersModule } from './manufacturers/manufacturers.module';
import { MotocycleModelsModule } from './motocycle-model/motocycle-models.module';
import { AuthModule } from './auth/auth.module';
import { UserMotocycleModule } from './user-motocycle/user-motocycle.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { RideModule } from './ride/ride.module';
import { MotorcyclePartModule } from './motorcycle-part/motorcycle-part.module';
import { PartWearModule } from './part-wear/part-wear.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 10,
      verboseMemoryLeak: true,
      ignoreErrors: false,
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    ManufacturersModule,
    MotocycleModelsModule,
    UserMotocycleModule,
    MotorcyclePartModule,
    PartWearModule,
    MaintenanceModule,
    RideModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
