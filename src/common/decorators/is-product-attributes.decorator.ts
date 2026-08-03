import { ValidationArguments, ValidationOptions, ValidateBy } from "class-validator";

export const IS_PRODUCT_VARIANT_ATTRIBUTES = "isProductVariantAttributes";

export function IsProductVariantAttributes(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_PRODUCT_VARIANT_ATTRIBUTES,
      validator: {
        validate(value: unknown) {
          if (value == null) {
            return true;
          }

          if (!Array.isArray(value)) {
            return false;
          }

          return value.every(
            (entry) =>
              entry !== null &&
              typeof entry === "object" &&
              !Array.isArray(entry) &&
              Object.values(entry).every((v) => typeof v === "string"),
          );
        },

        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be an array of objects containing only string values`;
        },
      },
    },
    validationOptions,
  );
}
