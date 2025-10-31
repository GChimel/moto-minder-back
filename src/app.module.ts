import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { UserModule } from './user/user.module';
import { MotocycleModelsModule } from './motocycle-model/motocycle-models.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    UserModule,
    MotocycleModelsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
