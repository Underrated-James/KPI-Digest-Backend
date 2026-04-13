import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketSchema } from './infrastracture/models/ticket-model';
import { GetTicketsUseCase } from './application/use-cases/use-cases-tickets/get-tickets-use-case';
import { TicketsController } from './application/controllers/tickets.controller';
import { TicketsAssignController } from './application/controllers/tickets-assign.controller';
import { TicketMongooseRepository } from './application/services/tickets-impl-repository';
import { CreateTicketUseCase } from './application/use-cases/use-cases-tickets/create-ticket-use-case';
import { DeleteTicketUseCase } from './application/use-cases/use-cases-tickets/delete-ticket-use-case';
import { GetTicketByIdUseCase } from './application/use-cases/use-cases-tickets/get-ticket-by-id-user-case';
import { PatchTicketUseCase } from './application/use-cases/use-cases-tickets/patch-ticket-use-case';
import { PutTicketUseCase } from './application/use-cases/use-cases-tickets/put-ticket-use-case';
import { GetAvailableMembersUseCase } from './application/use-cases/use-cases-tickets/get-available-members-use-case';

import { CreateAssignTicketUseCase } from './application/use-cases/use-cases-assign-ticket-sprint/create-assign-ticket-use-case';
import { GetAssignTicketsUseCase } from './application/use-cases/use-cases-assign-ticket-sprint/get-assign-ticket-use-case';
import { GetAssignTicketByIdUseCase } from './application/use-cases/use-cases-assign-ticket-sprint/get-assign-ticket-by-id-use-case';
import { PatchAssignTicketUseCase } from './application/use-cases/use-cases-assign-ticket-sprint/patch-assign-ticket-use-case';
import { PutAssignTicketUseCase } from './application/use-cases/use-cases-assign-ticket-sprint/put-assign-ticket-use-case';
import { DeleteAssignTicketUseCase } from './application/use-cases/use-cases-assign-ticket-sprint/delete-assign-ticket-use-case';

import { TICKET_MODEL, TICKET_REPOSITORY } from './domain/constants/ticket.constants';
import { SprintsModule } from '../sprints/sprints.module';
import { TeamsModule } from '../teams/teams.module';
import { UsersModule } from '../users/users.module';


@Module({
    imports: [
        MongooseModule.forFeature([{ name: TICKET_MODEL, schema: TicketSchema }]),
        SprintsModule,
        TeamsModule,
        UsersModule
    ],
    controllers: [TicketsController, TicketsAssignController],
    providers: [
        GetTicketsUseCase,
        CreateTicketUseCase,
        GetTicketByIdUseCase,
        PatchTicketUseCase,
        PutTicketUseCase,
        DeleteTicketUseCase,
        GetAvailableMembersUseCase,
        CreateAssignTicketUseCase,
        GetAssignTicketsUseCase,
        GetAssignTicketByIdUseCase,
        PatchAssignTicketUseCase,
        PutAssignTicketUseCase,
        DeleteAssignTicketUseCase,
        {
            provide: TICKET_REPOSITORY,
            useClass: TicketMongooseRepository
        }
    ],
    exports: [
        TICKET_REPOSITORY,
        GetTicketsUseCase,
        CreateTicketUseCase,
        GetTicketByIdUseCase,
        PatchTicketUseCase,
        PutTicketUseCase,
        DeleteTicketUseCase,
        GetAvailableMembersUseCase,
        CreateAssignTicketUseCase,
        GetAssignTicketsUseCase,
        GetAssignTicketByIdUseCase,
        PatchAssignTicketUseCase,
        PutAssignTicketUseCase,
        DeleteAssignTicketUseCase,
    ]
})
export class TicketsModule { }
