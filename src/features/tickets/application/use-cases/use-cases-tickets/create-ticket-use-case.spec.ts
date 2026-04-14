import { CreateTicketUseCase } from './create-ticket-use-case';
import { TicketStatus } from '../../../domain/enums/ticket-status';
import { Ticket } from '../../../domain/entities/ticket.entity';

describe('CreateTicketUseCase', () => {
  it('creates an unassigned ticket without sprint or team', async () => {
    const createdTicket = new Ticket(
      'ticket-1',
      'project-1',
      null,
      null,
      null,
      null,
      'KPI-101',
      TicketStatus.Open,
      'Build project-level assignment flow',
      'https://jira.example.com/KPI-101',
      null,
      null,
    );

    const ticketRepository = {
      findTicketNumber: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue(createdTicket),
      createMany: jest.fn(),
      findAll: jest.fn(),
    };

    const sprintRepository = {
      findById: jest.fn(),
    };

    const teamRepository = {
      findBySprintId: jest.fn(),
    };

    const ticketAssignmentValidator = {
      assertProjectExists: jest.fn().mockResolvedValue(undefined),
      validateSprint: jest.fn(),
      validateAssignments: jest.fn().mockResolvedValue(undefined),
    };

    const useCase = new CreateTicketUseCase(
      ticketRepository as any,
      sprintRepository as any,
      teamRepository as any,
      ticketAssignmentValidator as any,
    );

    const result = await useCase.execute({
      projectId: 'project-1',
      ticketNumber: 'KPI-101',
      ticketTitle: 'Build project-level assignment flow',
      descriptionLink: 'https://jira.example.com/KPI-101',
    });

    expect(ticketRepository.findTicketNumber).toHaveBeenCalledWith('KPI-101');
    expect(sprintRepository.findById).not.toHaveBeenCalled();
    expect(teamRepository.findBySprintId).not.toHaveBeenCalled();
    expect(ticketAssignmentValidator.assertProjectExists).toHaveBeenCalledWith(
      'project-1',
    );
    expect(ticketAssignmentValidator.validateSprint).toHaveBeenCalledWith(
      undefined,
      null,
      'project-1',
    );
    expect(ticketAssignmentValidator.validateAssignments).toHaveBeenCalledWith({
      projectId: 'project-1',
      assignedDevId: null,
      assignedQaId: null,
      team: null,
    });
    expect(ticketRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        projectId: 'project-1',
        sprintId: null,
        teamId: null,
        assignedDevId: null,
        assignedQaId: null,
        ticketNumber: 'KPI-101',
        status: TicketStatus.Open,
      }),
    );
    expect(result).toBe(createdTicket);
  });
});
