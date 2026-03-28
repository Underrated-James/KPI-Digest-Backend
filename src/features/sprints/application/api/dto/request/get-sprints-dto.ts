import { IsOptional, IsEnum, IsMongoId } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { SprintStatus } from '../../../../domain/enums/sprint-status-enums';

export class GetSprintsQueryDto extends PaginationQueryDto {
    @IsOptional()
    @IsEnum(SprintStatus, { message: 'Invalid sprint status value' })
    status?: SprintStatus;
    @IsOptional()
    @IsMongoId({ message: 'Invalid project ID' })
    projectId?: string;
}