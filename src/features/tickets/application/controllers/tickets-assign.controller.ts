import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { CreateAssignTicketUseCase } from '../use-cases/use-cases-assign-ticket-sprint/create-assign-ticket-use-case';
import { GetAssignTicketsUseCase } from '../use-cases/use-cases-assign-ticket-sprint/get-assign-ticket-use-case';
import { GetAssignTicketByIdUseCase } from '../use-cases/use-cases-assign-ticket-sprint/get-assign-ticket-by-id-use-case';
import { PatchAssignTicketUseCase } from '../use-cases/use-cases-assign-ticket-sprint/patch-assign-ticket-use-case';
import { PutAssignTicketUseCase } from '../use-cases/use-cases-assign-ticket-sprint/put-assign-ticket-use-case';
import { DeleteAssignTicketUseCase } from '../use-cases/use-cases-assign-ticket-sprint/delete-assign-ticket-use-case';
import { ResponseMessage } from '../../../../common/decorators/response-message.decorator';
import { ParseMongoIdPipe } from '../../../../common/pipes/parse-mongo-id.pipe';
import { TICKET_MODEL, TICKET_RESPONSE_MESSAGES } from '../../domain/constants/ticket.constants';
import { CreateAssignTicketDto } from '../api/dto/request/create-assign-ticket-dto';
import { PutAssignTicketDto } from '../api/dto/request/put-assign-ticket-dto';
import { PatchAssignTicketDto } from '../api/dto/request/patch-assign-ticket.dto';
import { AssignTicketResponseDto } from '../api/dto/response/assign-ticket-response-dto';
import { GetTicketQueryDto } from '../api/dto/request/get-tickets-dto';

@Controller('tickets-assign')
export class TicketsAssignController {
  constructor(
    private readonly createAssignTicketUseCase: CreateAssignTicketUseCase,
    private readonly getAssignTicketsUseCase: GetAssignTicketsUseCase,
    private readonly getAssignTicketByIdUseCase: GetAssignTicketByIdUseCase,
    private readonly patchAssignTicketUseCase: PatchAssignTicketUseCase,
    private readonly putAssignTicketUseCase: PutAssignTicketUseCase,
    private readonly deleteAssignTicketUseCase: DeleteAssignTicketUseCase,
  ) { }

  @Post()
  @ResponseMessage(TICKET_RESPONSE_MESSAGES.CREATED)
  async create(@Body() createAssignTicketDto: CreateAssignTicketDto | CreateAssignTicketDto[]) {
    const tickets = await this.createAssignTicketUseCase.execute(createAssignTicketDto);
    if (Array.isArray(tickets)) {
      return AssignTicketResponseDto.fromEntities(tickets as any[]);
    }
    return AssignTicketResponseDto.fromEntity(tickets as any);
  }

  @Get()
  @ResponseMessage(TICKET_RESPONSE_MESSAGES.RETRIEVED_ALL)
  async findAll(@Query() query: GetTicketQueryDto) {
    const tickets = await this.getAssignTicketsUseCase.execute(
        query.status,
        query.projectId,
        query.sprintId,
        query.teamId,
    );
    return AssignTicketResponseDto.fromEntities(tickets as any[]);
  }

  @Get(':id')
  @ResponseMessage(TICKET_RESPONSE_MESSAGES.RETRIEVED_ONE)
  async findOne(@Param('id', new ParseMongoIdPipe(TICKET_MODEL)) id: string) {
    const ticket = await this.getAssignTicketByIdUseCase.execute(id);
    return AssignTicketResponseDto.fromEntity(ticket as any);
  }

  @Patch(':id')
  @ResponseMessage(TICKET_RESPONSE_MESSAGES.PATCHED)
  async patch(
    @Param('id', new ParseMongoIdPipe(TICKET_MODEL)) id: string,
    @Body() patchAssignTicketDto: PatchAssignTicketDto
  ) {
    const ticket = await this.patchAssignTicketUseCase.execute(id, patchAssignTicketDto);
    return AssignTicketResponseDto.fromEntity(ticket as any);
  }

  @Put(':id')
  @ResponseMessage(TICKET_RESPONSE_MESSAGES.PUT)
  async put(
    @Param('id', new ParseMongoIdPipe(TICKET_MODEL)) id: string,
    @Body() putAssignTicketDto: PutAssignTicketDto
  ) {
    const ticket = await this.putAssignTicketUseCase.execute(id, putAssignTicketDto);
    return AssignTicketResponseDto.fromEntity(ticket as any);
  }

  @Delete(':id')
  @ResponseMessage(TICKET_RESPONSE_MESSAGES.DELETED)
  async remove(@Param('id', new ParseMongoIdPipe(TICKET_MODEL)) id: string) {
    await this.deleteAssignTicketUseCase.execute(id);
  }
}
