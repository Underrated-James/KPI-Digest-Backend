import { IsOptional, IsEnum, IsString } from 'class-validator';
import { UserRole } from '../../../../domain/enums/user-role.enum';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

export class GetUserQueryDto extends PaginationQueryDto {
    @IsOptional()
    @IsEnum(UserRole, { message: 'Invalid role value' })
    role?: UserRole;

    @IsOptional()
    @IsString()
    search?: string;
}