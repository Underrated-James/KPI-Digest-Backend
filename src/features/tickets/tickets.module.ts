import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketSchema } from './infrastracture/models/ticket-model';
import { GetTicketsUseCase } from './application/use-cases/use-cases-tickets/get-tickets-use-case';
import { TicketsController } from './application/controllers/tickets.controller';
import { TicketMongooseRepository } from './application/services/tickets-impl-repository';
import { CreateTicketUseCase } from './application/use-cases/use-cases-tickets/create-ticket-use-case';
import { DeleteTicketUseCase } from './application/use-cases/use-cases-tickets/delete-ticket-use-case';
import { GetTicketByIdUseCase } from './application/use-cases/use-cases-tickets/get-ticket-by-id-user-case';
import { PatchTicketUseCase } from './application/use-cases/use-cases-tickets/patch-ticket-use-case';
import { PutTicketUseCase } from './application/use-cases/use-cases-tickets/put-ticket-use-case';
import { GetAvailableMembersUseCase } from './application/use-cases/use-cases-tickets/get-available-members-use-case';
import { BulkPatchTicketUseCase } from './application/use-cases/use-cases-tickets/bulk-patch-ticket-use-case';
import { GetSprintCapacityUseCase } from './application/use-cases/use-cases-tickets/get-sprint-capacity-use-case';
import { TicketAssignmentValidatorService } from './application/services/ticket-assignment-validator.service';

import { TICKET_MODEL, TICKET_REPOSITORY } from './domain/constants/ticket.constants';
import { SprintsModule } from '../sprints/sprints.module';
import { TeamsModule } from '../teams/teams.module';
import { UsersModule } from '../users/users.module';
import { ProjectModule } from '../project/project.module';


@Module({
    imports: [
        MongooseModule.forFeature([{ name: TICKET_MODEL, schema: TicketSchema }]),
        forwardRef(() => SprintsModule),
        TeamsModule,
        UsersModule,
        ProjectModule,
    ],
    controllers: [TicketsController],
    providers: [
        GetTicketsUseCase,
        CreateTicketUseCase,
        GetTicketByIdUseCase,
        PatchTicketUseCase,
        PutTicketUseCase,
        DeleteTicketUseCase,
        GetAvailableMembersUseCase,
        BulkPatchTicketUseCase,
        GetSprintCapacityUseCase,
        TicketAssignmentValidatorService,
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
        BulkPatchTicketUseCase,
    ]
})
export class TicketsModule { }
