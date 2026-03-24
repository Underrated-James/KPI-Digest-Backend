import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Core Infrastructure
import { DatabaseModule } from './core/database/database-module';

// Feature Modules
import { UsersModule } from './features/users/users.module';
import { SprintsModule } from './features/sprints/sprints.module';
import { TicketsModule } from './features/tickets/tickets.module';
import { TeamsModule } from './features/teams/teams.module';

// App Base (Optional - consider moving to a 'Health' feature later)
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // 1. Global Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 2. Centralized Infrastructure
    DatabaseModule,

    // 3. Business Features
    UsersModule,
    SprintsModule,
    TicketsModule,
    TeamsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}