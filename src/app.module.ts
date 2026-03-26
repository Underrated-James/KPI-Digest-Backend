import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Core Infrastructure
import { DatabaseModule } from './core/database/database-module';

// Feature Modules
import { UsersModule } from './features/users/users.module';
import { ProjectModule } from './features/project/project.module';
import { SprintsModule } from './features/sprints/sprints.module';
import { TicketsModule } from './features/tickets/tickets.module';
import { TeamsModule } from './features/teams/teams.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Global Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Centralized Infrastructure
    DatabaseModule,

    // Business Features
    UsersModule,
    ProjectModule,
    SprintsModule,
    TicketsModule,
    TeamsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}