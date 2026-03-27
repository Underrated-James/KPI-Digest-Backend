import { IsEnum, IsNotEmpty } from "class-validator";
import { IsRealDate } from "src/common/decorators/is-real-dates-decorator";
import { LeaveTypes } from "./leave-types-enums";
import { Type } from "class-transformer";

export class LeaveDays {

    @IsEnum(LeaveTypes, { each: true, message: `Each leave type must be one of the following values: ${Object.values(LeaveTypes).join(', ')}` })
    @IsNotEmpty({ message: 'Leave type is required' })
    leaveType: LeaveTypes[];

    @IsRealDate({ message: 'Date must be a valid calendar date' })
    @IsNotEmpty({ message: 'Date is required' })
    @Type(() => Date)
    leaveDate: Date;

}