import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketSchema } from './infrastracture/models/ticket-model';
import { GetTicketsUseCase } from './application/use-cases/get-ticket-use-case';
import { TicketsController } from './application/controllers/tickets.controller';
import { TicketMongooseRepository } from './application/services/tickets-impl-repository';
import { CreateTicketUseCase } from './application/use-cases/create-ticket-use-case';
import { DeleteTicketUseCase } from './application/use-cases/delete-ticket-use-case';
import { GetTicketByIdUseCase } from './application/use-cases/get-ticket-by-id-user-case';
import { PatchTicketUseCase } from './application/use-cases/patch-ticket-use-case';
import { PutTicketUseCase } from './application/use-cases/put-ticket-use-case';
import { TICKET_MODEL, TICKET_REPOSITORY } from './domain/constants/ticket.constants';


@Module({
    imports: [
        MongooseModule.forFeature([{ name: TICKET_MODEL, schema: TicketSchema }])
    ],
    controllers: [TicketsController],
    providers: [
        GetTicketsUseCase,
        CreateTicketUseCase,
        GetTicketByIdUseCase,
        PatchTicketUseCase,
        PutTicketUseCase,
        DeleteTicketUseCase,
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
        DeleteTicketUseCase
    ]
})
export class TicketsModule { }
