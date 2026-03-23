import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsEnum(["ADMIN", "DEVS", "QA"], {
        message: 'Valid Role is Required'
    })
    role: "ADMIN" | "DEVS" | "QA";
}
