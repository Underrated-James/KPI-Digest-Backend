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
import { CreateTicketUseCase } from '../use-cases/create-ticket-use-case';
import { GetTicketsUseCase } from '../use-cases/get-ticket-use-case';
import { GetTicketByIdUseCase } from '../use-cases/get-ticket-by-id-user-case';
import { PatchTicketUseCase } from '../use-cases/patch-ticket-use-case';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { TICKET_MODEL, TICKET_RESPONSE_MESSAGES } from '../../domain/constants/ticket.constants';
import { DeleteTicketUseCase } from '../use-cases/delete-ticket-use-case';
import { PutTicketUseCase } from '../use-cases/put-ticket-use-case';
import { GetTicketQueryDto } from '../api/dto/request/get-tickets-dto';
import { TicketResponseDto } from '../api/dto/response/tickets-reponse-dto';
import { PutTicketDto } from '../api/dto/request/put-ticket-dto';
import { PatchTicketDto } from '../api/dto/request/patch-ticket.dto';
import { CreateTicketDto } from '../api/dto/request/create-ticket-dto';


@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly createTicketUseCase: CreateTicketUseCase,
    private readonly getTicketsUseCase: GetTicketsUseCase,
    private readonly getTicketByIdUseCase: GetTicketByIdUseCase,
    private readonly patchTicketUseCase: PatchTicketUseCase,
    private readonly putTicketUseCase: PutTicketUseCase,
    private readonly deleteTicketUseCase: DeleteTicketUseCase,
  ) { }


  // Get All Tickets (Paginated)
  @Get()
  @ResponseMessage(TICKET_RESPONSE_MESSAGES.RETRIEVED_ALL)
  async findAll(
    @Query() getTicketQueryDto: GetTicketQueryDto
  ) {
    const tickets = await this.getTicketsUseCase.execute(
      getTicketQueryDto.page,
      getTicketQueryDto.size,
      getTicketQueryDto.ticketStatus
    );
    return TicketResponseDto.fromPaginatedResult(tickets);
  }

  // Create a New Ticket
  @Post()
  @ResponseMessage(TICKET_RESPONSE_MESSAGES.CREATED)
  async create(@Body() createTicketDto: CreateTicketDto) {
    const ticket = await this.createTicketUseCase.execute(createTicketDto);
    return TicketResponseDto.fromEntity(ticket);
  }

  // Get a Ticket by ID
  @Get(':id')
  @ResponseMessage(TICKET_RESPONSE_MESSAGES.RETRIEVED_ONE)
  async findOne(@Param('id', new ParseMongoIdPipe(TICKET_MODEL)) id: string) {
    const ticket = await this.getTicketByIdUseCase.execute(id);
    return TicketResponseDto.fromEntity(ticket);
  }

  // Patch Ticket by ID
  @Patch(':id')
  @ResponseMessage(TICKET_RESPONSE_MESSAGES.PATCHED)
  async patch(
    @Param('id', new ParseMongoIdPipe(TICKET_MODEL)) id: string,
    @Body() patchTicketDto: PatchTicketDto
  ) {
    const ticket = await this.patchTicketUseCase.execute(id, patchTicketDto);
    return TicketResponseDto.fromEntity(ticket);
  }

  @Put(':id')
  @ResponseMessage(TICKET_RESPONSE_MESSAGES.PUT)
  async put(
    @Param('id', new ParseMongoIdPipe(TICKET_MODEL)) id: string,
    @Body() putTicketDto: PutTicketDto
  ) {
    const ticket = await this.putTicketUseCase.execute(id, putTicketDto);
    return TicketResponseDto.fromEntity(ticket);
  }

  @Delete(':id')
  @ResponseMessage(TICKET_RESPONSE_MESSAGES.DELETED)
  async remove(@Param('id', new ParseMongoIdPipe(TICKET_MODEL)) id: string) {
    await this.deleteTicketUseCase.execute(id);
  }
}
