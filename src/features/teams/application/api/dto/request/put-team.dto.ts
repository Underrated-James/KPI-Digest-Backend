import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ListOfUsers } from './create-team.dto';

export class PutTeamDto {
    @IsNotEmpty()
    @IsString()
    projectId: string;

    @IsNotEmpty()
    @IsString()
    sprintId: string;

    @IsNotEmpty()
    @IsNumber()
    HoursDay: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ListOfUsers)
    userIds: ListOfUsers[];

    @IsNotEmpty({ message: 'Allocation percentage is required' })
    @IsNumber()
    allocationPercentage: number;

    @IsNotEmpty({ message: 'Calculated hours per day is required' })
    @IsNumber()
    calculatedHoursPerDay: number;

}

