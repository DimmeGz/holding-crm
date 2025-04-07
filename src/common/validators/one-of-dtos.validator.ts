import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@ValidatorConstraint({ name: 'IsOneOfDtos', async: false })
export class IsOneOfDtosConstraint implements ValidatorConstraintInterface {
  validate(values: any[], args: ValidationArguments) {
    const dtoClasses = args.constraints as any[];

    for (const value of values) {
      let isOk = false;
      for (const DtoClass of dtoClasses) {
        const instance = plainToInstance(DtoClass, value);
        const errors = validateSync(instance);

        if (errors.length === 0) {
          isOk = true;
          continue;
        }
      }

      if (!isOk) return false;
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const dtoNames = (args.constraints as any[])
      .map((dto) => dto.name)
      .join(', ');
    return `Value does not match any of the allowed DTOs: ${dtoNames}`;
  }
}
