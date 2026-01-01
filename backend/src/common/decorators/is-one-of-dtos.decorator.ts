import { Validate } from 'class-validator';
import { IsOneOfDtosConstraint } from '../validators';

export function IsOneOfDtos(...dtoClasses): PropertyDecorator {
  return Validate(IsOneOfDtosConstraint, dtoClasses);
}
