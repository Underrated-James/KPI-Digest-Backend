import { PartialType } from '@nestjs/mapped-types';
import { CreateAssignTicketDto } from './create-assign-ticket-dto';
import { IsEnum, IsOptional } from 'class-validator';
import { TicketStatus } from '../../../../domain/enums/ticket-status';

export class PatchAssignTicketDto extends PartialType(CreateAssignTicketDto) {
    @IsOptional()
    @IsEnum(TicketStatus)
    status?: TicketStatus;
}
