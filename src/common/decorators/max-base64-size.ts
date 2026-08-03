import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from "class-validator";

export const MAX_BASE64_SIZE = "maxBase64Size";

@ValidatorConstraint({ name: MAX_BASE64_SIZE, async: false })
export class MaxBase64SizeConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments): boolean {
    if (typeof value !== "string") {
      return false;
    }

    const maxSizeInMB = args.constraints[0] as number;
    const base64 = value.replace(/^data:.+;base64,/, "");
    const sizeInBytes = Buffer.byteLength(base64, "base64");
    return sizeInBytes <= maxSizeInMB * 1024 * 1024;
  }

  defaultMessage(args: ValidationArguments): string {
    return `The image size must not exceed ${args.constraints[0]} MB.`;
  }
}

export const MaxBase64Size = ({
  MB,
  validationOptions,
}: {
  MB: number;
  validationOptions?: ValidationOptions;
}) => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      constraints: [MB],
      options: validationOptions,
      validator: MaxBase64SizeConstraint,
    });
  };
};
