import { IsArray, IsString, IsNotEmpty, ArrayMinSize } from 'class-validator';

export class AssignTicketsToSprintDto {
    @IsArray()
    @ArrayMinSize(1, { message: 'At least one ticket ID is required' })
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    ticketIds: string[];
}