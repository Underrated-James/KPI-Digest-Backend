import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

// Base App files
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Feature Modules
import { UsersModule } from './users/users.module';
@Module({
  imports: [
    // 1. Setup Environment Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 2. Database Connection (Asynchronous)
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),

    // 3. Feature Modules
    UsersModule
    // ProjectsModule,
    // TicketsModule,
    // SprintsModule,
    // TeamsModule,
  ],
  controllers: [AppController],
  providers: [AppService], 
})
export class AppModule {}