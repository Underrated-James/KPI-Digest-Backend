import { Test, TestingModule } from '@nestjs/testing';
import { TicketsController } from './application/controllers/tickets.controller';
import { CreateTicketUseCase } from './application/use-cases/use-cases-tickets/create-ticket-use-case';
import { GetTicketsUseCase } from './application/use-cases/use-cases-tickets/get-tickets-use-case';
import { GetTicketByIdUseCase } from './application/use-cases/use-cases-tickets/get-ticket-by-id-user-case';
import { PatchTicketUseCase } from './application/use-cases/use-cases-tickets/patch-ticket-use-case';
import { PutTicketUseCase } from './application/use-cases/use-cases-tickets/put-ticket-use-case';
import { DeleteTicketUseCase } from './application/use-cases/use-cases-tickets/delete-ticket-use-case';
import { GetAvailableMembersUseCase } from './application/use-cases/use-cases-tickets/get-available-members-use-case';
import { BulkPatchTicketUseCase } from './application/use-cases/use-cases-tickets/bulk-patch-ticket-use-case';

describe('TicketsController', () => {
  let controller: TicketsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketsController],
      providers: [
        { provide: CreateTicketUseCase, useValue: {} },
        { provide: GetTicketsUseCase, useValue: {} },
        { provide: GetTicketByIdUseCase, useValue: {} },
        { provide: PatchTicketUseCase, useValue: {} },
        { provide: PutTicketUseCase, useValue: {} },
        { provide: DeleteTicketUseCase, useValue: {} },
        { provide: GetAvailableMembersUseCase, useValue: {} },
        { provide: BulkPatchTicketUseCase, useValue: {} },
      ],
    }).compile();

    controller = module.get<TicketsController>(TicketsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
