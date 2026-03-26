import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { DateUtils } from '../../shared/date-utils';

export function IsWithinRange(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isWithinRange',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any[], args: ValidationArguments) {
          const dto = args.object as any;
          if (!value || !dto.startDate || !dto.endDate) return true;

          // Skip if dates are not valid real dates (let @IsRealDate handle it)
          if (!DateUtils.isValidRealDate(dto.startDate) || !DateUtils.isValidRealDate(dto.endDate)) {
            return true;
          }

          const start = new Date(dto.startDate);
          start.setUTCHours(0, 0, 0, 0);
          const end = new Date(dto.endDate);
          end.setUTCHours(23, 59, 59, 999);

          return value.every(off => {
            if (!DateUtils.isValidRealDate(off.date)) return true;
            
            const d = new Date(off.date);
            d.setUTCHours(0, 0, 0, 0);
            return d.getTime() >= start.getTime() && d.getTime() <= end.getTime();
          });
        },
        defaultMessage(args: ValidationArguments) {
          return `One or more day-off dates are outside the sprint range`;
        }
      },
    });
  };
}