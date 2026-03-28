import { IsOptional, IsEnum } from 'class-validator';
import { ProjectStatus } from '../../../../domain/enums/project-status-enums';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

export class GetProjectQueryDto extends PaginationQueryDto {
    @IsOptional()
    @IsEnum(ProjectStatus, { message: 'Invalid status value' })
    status?: ProjectStatus;
}