import { PipeTransform, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!isValidObjectId(value)) {
      throw new NotFoundException(`User not found with ID: ${value}`);
    }
    return value;
  }
}
