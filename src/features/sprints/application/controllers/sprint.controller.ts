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

import { SprintStatus } from '../../domain/enums/sprint-status-enums';
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

@Controller('sprints')
export class SprintController {
  constructor(
    private readonly createSprintUseCase: CreateSprintUseCase,
    private readonly getSprintUseCase: GetSprintUseCase,
    private readonly getSprintByIdUseCase: GetSprintByIdUseCase,
    private readonly patchSprintUseCase: PatchSprintUseCase,
    private readonly putSprintUseCase: PutSprintUseCase,
    private readonly deleteSprintUseCase: DeleteSprintUseCase,
  ) {}


  // Create a New Project
  @Post()
  @ResponseMessage('Sprint created successfully')
  async create(@Body() createSprintDto: CreateSprintDto) {
    const sprint = await this.createSprintUseCase.execute(createSprintDto);
    return SprintResponseDto.fromEntity(sprint);
  }

  // Get All Projects
  @Get()
  @ResponseMessage('Sprints retrieved successfully')
  async findAll(@Query('status') status?: SprintStatus) {
    const sprints = await this.getSprintUseCase.execute(status);
    return SprintResponseDto.fromEntities(sprints);
  }

  // Get a Project by ID
  @Get(':id')
  @ResponseMessage('Sprint retrieved successfully')
  async findOne(@Param('id', ParseMongoIdPipe) id: string) {
    const sprint = await this.getSprintByIdUseCase.execute(id);
    return SprintResponseDto.fromEntity(sprint);
  }

  // Patch User by ID
  @Patch(':id')
  @ResponseMessage('Sprint patched successfully')
  async patch(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() patchSprintDto: PatchSprintDto
  ) {
    const sprint = await this.patchSprintUseCase.execute(id, patchSprintDto);
    return SprintResponseDto.fromEntity(sprint);
  }

  @Put(':id')
  @ResponseMessage('Sprint put successfully')
  async put(
    @Param('id', ParseMongoIdPipe) id: string,
     @Body() putSprintDto: PutSprintDto
    ) {
      const sprint = await this.putSprintUseCase.execute(id, putSprintDto);
    return SprintResponseDto.fromEntity(sprint);
  }

  @Delete(':id')
  @ResponseMessage('Sprint deleted successfully')
  async remove(@Param('id', ParseMongoIdPipe) id: string) {
    await this.deleteSprintUseCase.execute(id);
  }
}
