import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateSprintOverviewUseCase } from '../use-cases/create-sprint-overview-use-case';
import { GetSprintOverviewsUseCase } from '../use-cases/get-sprints-overview-use-case';
import { GetSprintOverviewByIdUseCase } from '../use-cases/get-sprint-overview-by-id-use-case';
import { GetSprintCanvasUseCase } from '../use-cases/get-sprint-overview-canvas-use-case';
import { PatchSprintOverviewUseCase } from '../use-cases/patch-sprint-overview-use-case';
import { PutSprintOverviewUseCase } from '../use-cases/put-sprint-overview-use-case';
import { DeleteSprintOverviewUseCase } from '../use-cases/delete-sprint-overview-use-case';
import { HardDeleteSprintOverviewUseCase } from '../use-cases/hard-delete-sprint-overview-use-case';
import { RestoreSprintOverviewUseCase } from '../use-cases/restore-sprint-overview-use-case';
import { CreateSprintOverviewDto } from '../api/dto/request/create-sprint-overview-dto';
import { PatchSprintOverviewDto } from '../api/dto/request/patch-sprint-overview-dto';
import { PutSprintOverviewDto } from '../api/dto/request/put-sprint-overview-dto';
import { GetSprintOverviewQueryDto } from '../api/dto/request/get-sprint-overview-dto';
import { SprintOverviewResponseDto } from '../api/dto/response/sprint-response-dto';
import { SPRINT_OVERVIEW_RESPONSE_MESSAGES } from '../../domain/constants/sprint-overview-constants';

@Controller('sprint-overviews')
export class SprintReviewController {
  constructor(
    private readonly createUseCase: CreateSprintOverviewUseCase,
    private readonly getManyUseCase: GetSprintOverviewsUseCase,
    private readonly getByIdUseCase: GetSprintOverviewByIdUseCase,
    private readonly getCanvasUseCase: GetSprintCanvasUseCase,
    private readonly patchUseCase: PatchSprintOverviewUseCase,
    private readonly putUseCase: PutSprintOverviewUseCase,
    private readonly deleteUseCase: DeleteSprintOverviewUseCase,
    private readonly hardDeleteUseCase: HardDeleteSprintOverviewUseCase,
    private readonly restoreUseCase: RestoreSprintOverviewUseCase,
  ) {}

  @Get('canvas/:sprintId')
  async getCanvas(
    @Param('sprintId') sprintId: string,
    @Query('page') page?: number,
    @Query('size') size?: number,
  ) {
    const result = await this.getCanvasUseCase.execute(sprintId, page, size);
    return {
      status: HttpStatus.OK,
      message: 'Sprint canvas data retrieved successfully',
      data: result,
    };
  }

  @Post()
  async create(@Body() dto: CreateSprintOverviewDto) {
    const result = await this.createUseCase.execute(dto);
    return {
      status: HttpStatus.CREATED,
      message: SPRINT_OVERVIEW_RESPONSE_MESSAGES.CREATED,
      data: SprintOverviewResponseDto.fromEntity(result),
    };
  }

  @Get()
  async findAll(@Query() query: GetSprintOverviewQueryDto) {
    const result = await this.getManyUseCase.execute(query);
    return {
      status: HttpStatus.OK,
      message: SPRINT_OVERVIEW_RESPONSE_MESSAGES.RETRIEVED_ALL,
      data: SprintOverviewResponseDto.fromPaginatedResult(result),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.getByIdUseCase.execute(id);
    return {
      status: HttpStatus.OK,
      message: SPRINT_OVERVIEW_RESPONSE_MESSAGES.RETRIEVED_ONE,
      data: SprintOverviewResponseDto.fromEntity(result),
    };
  }

  @Patch(':id')
  async patch(@Param('id') id: string, @Body() dto: PatchSprintOverviewDto) {
    const result = await this.patchUseCase.execute(id, dto);
    return {
      status: HttpStatus.OK,
      message: SPRINT_OVERVIEW_RESPONSE_MESSAGES.PATCHED,
      data: SprintOverviewResponseDto.fromEntity(result),
    };
  }

  @Put(':id')
  async put(@Param('id') id: string, @Body() dto: PutSprintOverviewDto) {
    const result = await this.putUseCase.execute(id, dto);
    return {
      status: HttpStatus.OK,
      message: SPRINT_OVERVIEW_RESPONSE_MESSAGES.PUT,
      data: SprintOverviewResponseDto.fromEntity(result),
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.deleteUseCase.execute(id);
    return {
      status: HttpStatus.OK,
      message: SPRINT_OVERVIEW_RESPONSE_MESSAGES.DELETED,
    };
  }

  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  async restore(@Param('id') id: string) {
    await this.restoreUseCase.execute(id);
    return {
      status: HttpStatus.OK,
      message: SPRINT_OVERVIEW_RESPONSE_MESSAGES.RESTORED,
    };
  }

  @Delete(':id/hard')
  @HttpCode(HttpStatus.OK)
  async hardDelete(@Param('id') id: string) {
    await this.hardDeleteUseCase.execute(id);
    return {
      status: HttpStatus.OK,
      message: SPRINT_OVERVIEW_RESPONSE_MESSAGES.HARD_DELETED,
    };
  }
}
