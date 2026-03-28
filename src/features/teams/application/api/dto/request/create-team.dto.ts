import {
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LeaveDays } from 'src/features/teams/domain/enums/leave-days-enums';
import { UserRole } from 'src/features/users/domain/enums/user-role.enum';

export class CreateTeamDto {
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


export class ListOfUsers {

    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEnum(UserRole, { message: `Role must be one of the following values: ${Object.values(UserRole).join(', ')}` })
    role: UserRole;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => LeaveDays)
    leave?: LeaveDays[];

}
