import { PipeTransform, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform<string, string> {
  constructor(private readonly entityName: string = 'Resource') {}

  transform(value: string): string {
    if (!isValidObjectId(value)) {
      throw new NotFoundException(`${this.entityName} with id '${value}' not found`);
    }
    return value;
  }
}
