import { IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../../../../domain/persistence/enums/user-role.enum';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

export class GetUserQueryDto extends PaginationQueryDto {
    @IsOptional()
    @IsEnum(UserRole, { message: 'Invalid role value' })
    role?: UserRole;
}