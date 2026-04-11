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


export class ListOfUsers {
    @IsNotEmpty({ message: 'User ID is required' })
    @IsString()
    userId: string;

    @IsNotEmpty({ message: 'Allocation percentage is required' })
    @IsNumber()
    allocationPercentage: number;

    @IsNotEmpty({ message: 'Hours per day is required' })
    @IsNumber()
    hoursPerDay: number;

    @IsNotEmpty({ message: 'Role is required' })
    @IsEnum(UserRole, { message: `Role must be one of the following values: ${Object.values(UserRole).join(', ')}` })
    role: UserRole;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => LeaveDays)
    leave?: LeaveDays[];
}
