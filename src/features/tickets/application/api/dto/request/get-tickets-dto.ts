import { IsOptional, IsEnum } from 'class-validator';
import { TicketStatus } from '../../../../domain/enums/ticket-status';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

export class GetTicketQueryDto extends PaginationQueryDto {
    @IsOptional()
    @IsEnum(TicketStatus, { message: 'Invalid status value' })
    ticketStatus?: TicketStatus;
}