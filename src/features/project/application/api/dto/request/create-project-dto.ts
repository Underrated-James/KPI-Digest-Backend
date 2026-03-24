import { IsBoolean, IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsBoolean()
  status: boolean;

  @IsDate()
  finishDate: Date;

  @IsDate()
  createdDate: Date;
}
