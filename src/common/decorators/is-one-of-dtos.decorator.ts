import { Validate } from 'class-validator';
import { IsOneOfDtosConstraint } from '../validators';

export function IsOneOfDtos(...dtoClasses) {
  return Validate(IsOneOfDtosConstraint, dtoClasses);
}
