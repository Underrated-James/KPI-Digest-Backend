import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketDto } from './create-ticket-dto';
import { IsEnum, IsOptional } from 'class-validator';
import { TicketStatus } from '../../../../domain/enums/ticket-status';

export class PatchTicketDto extends PartialType(CreateTicketDto) {
    @IsOptional()
    @IsEnum(TicketStatus)
    status?: TicketStatus;
}
