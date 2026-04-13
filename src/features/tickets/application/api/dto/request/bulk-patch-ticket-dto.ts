import { IsArray, ValidateNested, IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { PatchTicketDto } from './patch-ticket.dto';

export class BulkPatchTicketItemDto extends PatchTicketDto {
    @IsString()
    @IsNotEmpty()
    id: string;
}

export class BulkPatchTicketDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => BulkPatchTicketItemDto)
    tickets: BulkPatchTicketItemDto[];
}
