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
import { GetProjectsUseCase } from '../api/use-cases/get-projects-use-case';
import { CreateProjectUseCase } from '../api/use-cases/create-project-use-case';
import { GetProjectByIdUseCase } from '../api/use-cases/get-project-by-id-use-case';
import { PatchProjectUseCase } from '../api/use-cases/patch-project-use-case';
import { PutProjectUseCase } from '../api/use-cases/put-project-use-case';
import { DeleteProjectUseCase } from '../api/use-cases/delete-project-use-case';
import { ProjectResponseDto } from '../api/dto/response/project-response-dto';
import { ResponseMessage } from '../../../../common/decorators/response-message.decorator';
import { ParseMongoIdPipe } from '../../../../common/pipes/parse-mongo-id.pipe';
import { CreateProjectDto } from '../api/dto/request/create-project-dto';
import { PatchProjectDto } from '../api/dto/request/patch-project-dto';
import { PutProjectDto } from '../api/dto/request/put-project-dto';
import { GetProjectQueryDto } from '../api/dto/request/get-project-dto';
import { PROJECT_RESPONSE_MESSAGES, PROJECT_MODEL } from '../../domain/constants/project.constants';

@Controller('projects')
export class ProjectController {
  constructor(
    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly getProjectsUseCase: GetProjectsUseCase,
    private readonly getProjectByIdUseCase: GetProjectByIdUseCase,
    private readonly patchProjectUseCase: PatchProjectUseCase,
    private readonly putProjectUseCase: PutProjectUseCase,
    private readonly deleteProjectUseCase: DeleteProjectUseCase,
  ) { }


  // Get All Projects (Paginated)
  @Get()
  @ResponseMessage(PROJECT_RESPONSE_MESSAGES.RETRIEVED_ALL)
  async findAll(
    @Query() getProjectQueryDto: GetProjectQueryDto
  ) {
    const projects = await this.getProjectsUseCase.execute(
      getProjectQueryDto.page,
      getProjectQueryDto.size,
      getProjectQueryDto.status
    );
    return ProjectResponseDto.fromPaginatedResult(projects);
  }

  // Create a New Project
  @Post()
  @ResponseMessage(PROJECT_RESPONSE_MESSAGES.CREATED)
  async create(@Body() createProjectDto: CreateProjectDto) {
    const project = await this.createProjectUseCase.execute(createProjectDto);
    return ProjectResponseDto.fromEntity(project);
  }

  // Get a Project by ID
  @Get(':id')
  @ResponseMessage(PROJECT_RESPONSE_MESSAGES.RETRIEVED_ONE)
  async findOne(@Param('id', new ParseMongoIdPipe(PROJECT_MODEL)) id: string) {
    const project = await this.getProjectByIdUseCase.execute(id);
    return ProjectResponseDto.fromEntity(project);
  }

  // Patch User by ID
  @Patch(':id')
  @ResponseMessage(PROJECT_RESPONSE_MESSAGES.PATCHED)
  async patch(
    @Param('id', new ParseMongoIdPipe(PROJECT_MODEL)) id: string,
    @Body() patchProjectDto: PatchProjectDto
  ) {
    const project = await this.patchProjectUseCase.execute(id, patchProjectDto);
    return ProjectResponseDto.fromEntity(project);
  }

  @Put(':id')
  @ResponseMessage(PROJECT_RESPONSE_MESSAGES.PUT)
  async put(
    @Param('id', new ParseMongoIdPipe(PROJECT_MODEL)) id: string,
    @Body() putProjectDto: PutProjectDto
  ) {
    const project = await this.putProjectUseCase.execute(id, putProjectDto);
    return ProjectResponseDto.fromEntity(project);
  }

  @Delete(':id')
  @ResponseMessage(PROJECT_RESPONSE_MESSAGES.DELETED)
  async remove(@Param('id', new ParseMongoIdPipe(PROJECT_MODEL)) id: string) {
    await this.deleteProjectUseCase.execute(id);
  }
}
