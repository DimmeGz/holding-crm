import { ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
export declare class IsOneOfDtosConstraint implements ValidatorConstraintInterface {
    validate(values: any[], args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
