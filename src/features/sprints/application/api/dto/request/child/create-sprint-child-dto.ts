import { IsDateString, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class DayOffDto {
  @IsString()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(2)
  label: string;

  
  @IsDateString()
  @IsNotEmpty()
  date: string;
}