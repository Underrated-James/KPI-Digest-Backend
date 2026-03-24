import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from 'src/users/domain/persistence/enums/user-role.enum';


export class PutUserDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsEnum(UserRole, {
        message: 'Valid Role is Required (ADMIN, DEVS, or QA)'
    })
    role: UserRole;
}
