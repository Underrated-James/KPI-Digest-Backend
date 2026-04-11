import {
    IsArray,
    IsNotEmpty,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ListOfUsers } from './create-team.dto';

export class PutTeamDto {
    @IsNotEmpty({ message: 'Project ID is required' })
    @IsString()
    projectId: string;

    @IsNotEmpty({ message: 'Sprint ID is required' })
    @IsString()
    sprintId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ListOfUsers)
    userIds: ListOfUsers[];
}

