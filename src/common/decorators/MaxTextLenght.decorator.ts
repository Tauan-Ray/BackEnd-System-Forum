import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function MaxTextLength(max: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'maxTextLength',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [max],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;

          const text = value.replace(/<[^>]*>/g, '');
          return text.length <= max;
        },
        defaultMessage(args: ValidationArguments) {
          const maxLength = args.constraints[0];
          return `O ${args.property} deve conter no máximo ${maxLength} caracteres de texto puro.`;
        },
      },
    });
  };
}
