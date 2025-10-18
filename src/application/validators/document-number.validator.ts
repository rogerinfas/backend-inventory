import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { DocumentType } from '../../domain/enums/document-type.enum';

export function IsValidDocumentNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidDocumentNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          
          const obj = args.object as any;
          const documentType = obj.documentType;
          
          if (!documentType) return false;
          
          switch (documentType) {
            case DocumentType.DNI:
              return /^[0-9]{8}$/.test(value);
            case DocumentType.RUC:
              return /^[0-9]{11}$/.test(value);
            case DocumentType.CE:
              return /^[0-9]{9}$/.test(value);
            case DocumentType.PASSPORT:
              return /^[A-Z0-9]{6,12}$/.test(value);
            default:
              return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          const obj = args.object as any;
          const documentType = obj.documentType;
          
          switch (documentType) {
            case DocumentType.DNI:
              return 'El DNI debe tener exactamente 8 dígitos numéricos';
            case DocumentType.RUC:
              return 'El RUC debe tener exactamente 11 dígitos numéricos';
            case DocumentType.CE:
              return 'El CE debe tener exactamente 9 dígitos numéricos';
            case DocumentType.PASSPORT:
              return 'El PASSPORT debe tener entre 6 y 12 caracteres alfanuméricos en mayúsculas';
            default:
              return 'Tipo de documento no válido';
          }
        }
      }
    });
  };
}
