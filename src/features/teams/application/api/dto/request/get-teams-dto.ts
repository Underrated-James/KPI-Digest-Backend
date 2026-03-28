import { IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

export class GetTeamsQueryDto extends PaginationQueryDto {
    @IsOptional()
    sprintId?: string;
    @IsOptional()
    projectId?: string;
}