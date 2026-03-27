import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number) // Convert string "1" to number 1
  @IsInt()
  @Min(1)
  page: number = 1; // Default to page 1

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100) // Safety Cap — prevents ?size=1000000 from crashing RAM
  size: number = 10; // Default to 10 items
}
