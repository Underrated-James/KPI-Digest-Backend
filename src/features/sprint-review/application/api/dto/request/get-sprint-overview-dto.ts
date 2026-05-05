import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

export class GetSprintOverviewQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsString()
  sprintId?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
