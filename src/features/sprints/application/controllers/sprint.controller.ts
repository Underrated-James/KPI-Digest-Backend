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
import { GetSprintUseCase } from '../use-cases/get-sprints-use-case';

import { SprintResponseDto } from '../api/dto/response/sprint-response-dto';
import { ResponseMessage } from '../../../../common/decorators/response-message.decorator';
import { ParseMongoIdPipe } from '../../../../common/pipes/parse-mongo-id.pipe';
import { CreateSprintDto } from '../api/dto/request/create-sprint-parent-dto';
import { PatchSprintDto } from '../api/dto/request/patch-sprint-dto';
import { PutSprintDto } from '../api/dto/request/put-sprint-dto';
import { CreateSprintUseCase } from '../use-cases/create-sprint-use-case';
import { GetSprintByIdUseCase } from '../use-cases/get-sprint-by-id-use-case';
import { PatchSprintUseCase } from '../use-cases/patch-sprint-use-case';
import { PutSprintUseCase } from '../use-cases/put-sprint-use-case';
import { DeleteSprintUseCase } from '../use-cases/delete-sprint-use-case';
import { GetSprintsQueryDto } from '../api/dto/request/get-sprints-dto';
import { SPRINT_RESPONSE_MESSAGES, SPRINT_MODEL } from '../../domain/constants/sprint.constants';

@Controller('sprints')
export class SprintController {
  constructor(
    private readonly createSprintUseCase: CreateSprintUseCase,
    private readonly getSprintUseCase: GetSprintUseCase,
    private readonly getSprintByIdUseCase: GetSprintByIdUseCase,
    private readonly patchSprintUseCase: PatchSprintUseCase,
    private readonly putSprintUseCase: PutSprintUseCase,
    private readonly deleteSprintUseCase: DeleteSprintUseCase,
  ) { }


  // Create a New Project
  @Post()
  @ResponseMessage(SPRINT_RESPONSE_MESSAGES.CREATED)
  async create(@Body() createSprintDto: CreateSprintDto) {
    const sprint = await this.createSprintUseCase.execute(createSprintDto);
    return SprintResponseDto.fromEntity(sprint);
  }

  // Get All Projects
  @Get()
  @ResponseMessage(SPRINT_RESPONSE_MESSAGES.RETRIEVED_ALL)
  async findAll(
    @Query() paginationQuery: GetSprintsQueryDto,
  ) {
    const sprints = await this.getSprintUseCase.execute(
      paginationQuery.page,
      paginationQuery.size,
      paginationQuery.status,
      paginationQuery.projectId
    );
    return SprintResponseDto.fromPaginatedResult(sprints);
  }

  // Get a Project by ID
  @Get(':id')
  @ResponseMessage(SPRINT_RESPONSE_MESSAGES.RETRIEVED_ONE)
  async findOne(@Param('id', new ParseMongoIdPipe(SPRINT_MODEL)) id: string) {
    const sprint = await this.getSprintByIdUseCase.execute(id);
    return SprintResponseDto.fromEntity(sprint);
  }

  // Patch User by ID
  @Patch(':id')
  @ResponseMessage(SPRINT_RESPONSE_MESSAGES.PATCHED)
  async patch(
    @Param('id', new ParseMongoIdPipe(SPRINT_MODEL)) id: string,
    @Body() patchSprintDto: PatchSprintDto
  ) {
    const sprint = await this.patchSprintUseCase.execute(id, patchSprintDto);
    return SprintResponseDto.fromEntity(sprint);
  }

  @Put(':id')
  @ResponseMessage(SPRINT_RESPONSE_MESSAGES.PUT)
  async put(
    @Param('id', new ParseMongoIdPipe(SPRINT_MODEL)) id: string,
    @Body() putSprintDto: PutSprintDto
  ) {
    const sprint = await this.putSprintUseCase.execute(id, putSprintDto);
    return SprintResponseDto.fromEntity(sprint);
  }

  @Delete(':id')
  @ResponseMessage(SPRINT_RESPONSE_MESSAGES.DELETED)
  async remove(@Param('id', new ParseMongoIdPipe(SPRINT_MODEL)) id: string) {
    await this.deleteSprintUseCase.execute(id);
  }
}
