import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { DateUtils } from '../../shared/date-utils';

export function IsAfterStartDate(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isAfterStartDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          
          if (!value || !relatedValue) return true;

          // Skip if dates are not valid real dates (let @IsRealDate handle it)
          if (!DateUtils.isValidRealDate(value) || !DateUtils.isValidRealDate(relatedValue)) {
            return true;
          }

          const start = new Date(relatedValue);
          const end = new Date(value);

          // Official end may be set to "now" on the same calendar day as official start
          if (
            args.property === 'officialEndDate' &&
            relatedPropertyName === 'officialStartDate'
          ) {
            return end.getTime() >= start.getTime();
          }

          // Normalize to start of day UTC for comparison
          start.setUTCHours(0, 0, 0, 0);
          end.setUTCHours(0, 0, 0, 0);

          // Check if end is strictly greater than start (at least 1 day difference)
          return end.getTime() > start.getTime();
        },
        defaultMessage(args: ValidationArguments) {
          if (
            args.property === 'officialEndDate' &&
            args.constraints[0] === 'officialStartDate'
          ) {
            return `${args.property} must be on or after ${args.constraints[0]}`;
          }
          return `${args.property} must be at least one day after ${args.constraints[0]}`;
        },
      },
    });
  };
}