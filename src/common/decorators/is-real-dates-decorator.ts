import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { DateUtils } from '../../shared/date-utils';

export function IsRealDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isRealDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return DateUtils.isValidRealDate(value);
        },
        defaultMessage(args: ValidationArguments) {
          const value = args.value;
          if (typeof value === 'string' && !DateUtils.isValidISOFormat(value)) {
            return `${args.property} must be in valid ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ)`;
          }
          return `${args.property} must be a valid calendar date`;
        },
      },
    });
  };
}