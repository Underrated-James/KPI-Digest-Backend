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
import { CreateTeamUseCase } from '../use-cases/create-team-use-case';
import { GetTeamsUseCase } from '../use-cases/get-teams-use-case';
import { GetTeamByIdUseCase } from '../use-cases/get-team-by-id-use-case';
import { PatchTeamUseCase } from '../use-cases/patch-team-use-case';
import { PutTeamUseCase } from '../use-cases/put-team-use-case';
import { DeleteTeamUseCase } from '../use-cases/delete-team-use-case';
import { CreateTeamDto } from '../api/dto/request/create-team.dto';
import { PatchTeamDto } from '../api/dto/request/patch-team.dto';
import { TeamResponseDto } from '../api/dto/response/teams-response-dto';
import { ResponseMessage } from '../../../../common/decorators/response-message.decorator';
import { ParseMongoIdPipe } from '../../../../common/pipes/parse-mongo-id.pipe';
import { GetTeamsQueryDto } from '../api/dto/request/get-teams-dto';
import { TEAM_RESPONSE_MESSAGES, TEAM_MODEL } from '../../domain/constants/team.constants';

@Controller('teams')
export class TeamsController {
  constructor(
    private readonly createTeamUseCase: CreateTeamUseCase,
    private readonly getTeamsUseCase: GetTeamsUseCase,
    private readonly getTeamByIdUseCase: GetTeamByIdUseCase,
    private readonly patchTeamUseCase: PatchTeamUseCase,
    private readonly putTeamUseCase: PutTeamUseCase,
    private readonly deleteTeamUseCase: DeleteTeamUseCase,
  ) { }

  // Create a New Team
  @Post()
  @ResponseMessage(TEAM_RESPONSE_MESSAGES.CREATED)
  async create(@Body() createTeamDto: CreateTeamDto) {
    const team = await this.createTeamUseCase.execute(createTeamDto);
    return TeamResponseDto.fromEntity(team);
  }

  // Get All Teams
  @Get()
  @ResponseMessage(TEAM_RESPONSE_MESSAGES.RETRIEVED_ALL)
  async findAll(
    @Query() paginationQuery: GetTeamsQueryDto,
  ) {
    const teams = await this.getTeamsUseCase.execute(
      paginationQuery.page,
      paginationQuery.size,
      paginationQuery.sprintId,
      paginationQuery.projectId
    );
    return TeamResponseDto.fromPaginatedResult(teams);
  }

  // Get a Team by ID
  @Get(':id')
  @ResponseMessage(TEAM_RESPONSE_MESSAGES.RETRIEVED_ONE)
  async findOne(@Param('id', new ParseMongoIdPipe(TEAM_MODEL)) id: string) {
    const team = await this.getTeamByIdUseCase.execute(id);
    return TeamResponseDto.fromEntity(team);
  }

  // Patch Team by ID
  @Patch(':id')
  @ResponseMessage(TEAM_RESPONSE_MESSAGES.PATCHED)
  async patch(
    @Param('id', new ParseMongoIdPipe(TEAM_MODEL)) id: string,
    @Body() patchTeamDto: PatchTeamDto,
  ) {
    const team = await this.patchTeamUseCase.execute(id, patchTeamDto);
    return TeamResponseDto.fromEntity(team);
  }

  // Put Team by ID
  @Put(':id')
  @ResponseMessage(TEAM_RESPONSE_MESSAGES.PUT)
  async put(
    @Param('id', new ParseMongoIdPipe(TEAM_MODEL)) id: string,
    @Body() putTeamDto: CreateTeamDto,
  ) {
    const team = await this.putTeamUseCase.execute(id, putTeamDto);
    return TeamResponseDto.fromEntity(team);
  }

  // Delete Team by ID
  @Delete(':id')
  @ResponseMessage(TEAM_RESPONSE_MESSAGES.DELETED)
  async remove(@Param('id', new ParseMongoIdPipe(TEAM_MODEL)) id: string) {
    await this.deleteTeamUseCase.execute(id);
  }
}
