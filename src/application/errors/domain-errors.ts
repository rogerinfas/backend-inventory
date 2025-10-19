export abstract class DomainError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;
  abstract readonly isOperational: boolean;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class PersonNotFoundError extends DomainError {
  readonly code = 'PERSON_NOT_FOUND';
  readonly statusCode = 404;
  readonly isOperational = true;

  constructor(id: string) {
    super(`Persona con ID ${id} no encontrada`);
  }
}

export class PersonAlreadyExistsError extends DomainError {
  readonly code = 'PERSON_ALREADY_EXISTS';
  readonly statusCode = 409;
  readonly isOperational = true;

  constructor(field: string, value: string) {
    super(`Ya existe una persona con ${field}: ${value}`);
  }
}

export class InvalidDocumentError extends DomainError {
  readonly code = 'INVALID_DOCUMENT';
  readonly statusCode = 400;
  readonly isOperational = true;

  constructor(message: string) {
    super(`Documento inválido: ${message}`);
  }
}

export class InvalidEmailError extends DomainError {
  readonly code = 'INVALID_EMAIL';
  readonly statusCode = 400;
  readonly isOperational = true;

  constructor(email: string) {
    super(`Email inválido: ${email}`);
  }
}

export class InvalidPhoneError extends DomainError {
  readonly code = 'INVALID_PHONE';
  readonly statusCode = 400;
  readonly isOperational = true;

  constructor(phone: string) {
    super(`Teléfono inválido: ${phone}`);
  }
}

export class PersonDeletedError extends DomainError {
  readonly code = 'PERSON_DELETED';
  readonly statusCode = 410;
  readonly isOperational = true;

  constructor(id: string) {
    super(`No se puede realizar la operación. La persona con ID ${id} está eliminada`);
  }
}

export class InvalidStatusChangeError extends DomainError {
  readonly code = 'INVALID_STATUS_CHANGE';
  readonly statusCode = 400;
  readonly isOperational = true;

  constructor(currentStatus: string, newStatus: string) {
    super(`No se puede cambiar el estado de ${currentStatus} a ${newStatus}`);
  }
}

// Store specific errors
export class StoreNotFoundError extends DomainError {
  readonly code = 'STORE_NOT_FOUND';
  readonly statusCode = 404;
  readonly isOperational = true;

  constructor(id: string) {
    super(`Tienda con ID ${id} no encontrada`);
  }
}

export class StoreAlreadyExistsError extends DomainError {
  readonly code = 'STORE_ALREADY_EXISTS';
  readonly statusCode = 409;
  readonly isOperational = true;

  constructor(field: string, value: string) {
    super(`Ya existe una tienda con ${field}: ${value}`);
  }
}

export class StoreDeletedError extends DomainError {
  readonly code = 'STORE_DELETED';
  readonly statusCode = 410;
  readonly isOperational = true;

  constructor(id: string) {
    super(`No se puede realizar la operación. La tienda con ID ${id} está eliminada`);
  }
}

export class InvalidRucError extends DomainError {
  readonly code = 'INVALID_RUC';
  readonly statusCode = 400;
  readonly isOperational = true;

  constructor(ruc: string) {
    super(`RUC inválido: ${ruc}. Debe tener exactamente 11 dígitos`);
  }
}

// Customer specific errors
export class CustomerNotFoundError extends DomainError {
  readonly code = 'CUSTOMER_NOT_FOUND';
  readonly statusCode = 404;
  readonly isOperational = true;

  constructor(id: string) {
    super(`Cliente con ID ${id} no encontrado`);
  }
}

export class CustomerAlreadyExistsError extends DomainError {
  readonly code = 'CUSTOMER_ALREADY_EXISTS';
  readonly statusCode = 409;
  readonly isOperational = true;

  constructor(storeId: string, personId: string) {
    super(`Ya existe un cliente para la tienda ${storeId} y persona ${personId}`);
  }
}

export class CustomerDeletedError extends DomainError {
  readonly code = 'CUSTOMER_DELETED';
  readonly statusCode = 410;
  readonly isOperational = true;

  constructor(id: string) {
    super(`No se puede realizar la operación. El cliente con ID ${id} está eliminado`);
  }
}

// Supplier specific errors
export class SupplierNotFoundError extends DomainError {
  readonly code = 'SUPPLIER_NOT_FOUND';
  readonly statusCode = 404;
  readonly isOperational = true;

  constructor(id: string) {
    super(`Proveedor con ID ${id} no encontrado`);
  }
}

export class SupplierAlreadyExistsError extends DomainError {
  readonly code = 'SUPPLIER_ALREADY_EXISTS';
  readonly statusCode = 409;
  readonly isOperational = true;

  constructor(storeId: string, personId: string) {
    super(`Ya existe un proveedor para la tienda ${storeId} y persona ${personId}`);
  }
}

export class SupplierDeletedError extends DomainError {
  readonly code = 'SUPPLIER_DELETED';
  readonly statusCode = 410;
  readonly isOperational = true;

  constructor(id: string) {
    super(`No se puede realizar la operación. El proveedor con ID ${id} está eliminado`);
  }
}

// User specific errors
export class UserNotFoundError extends DomainError {
  readonly code = 'USER_NOT_FOUND';
  readonly statusCode = 404;
  readonly isOperational = true;

  constructor(id: string) {
    super(`Usuario con ID ${id} no encontrado`);
  }
}

export class UserAlreadyExistsError extends DomainError {
  readonly code = 'USER_ALREADY_EXISTS';
  readonly statusCode = 409;
  readonly isOperational = true;

  constructor(field: string, value: string) {
    super(`Ya existe un usuario con ${field}: ${value}`);
  }
}

export class UserDeletedError extends DomainError {
  readonly code = 'USER_DELETED';
  readonly statusCode = 410;
  readonly isOperational = true;

  constructor(id: string) {
    super(`No se puede realizar la operación. El usuario con ID ${id} está eliminado`);
  }
}

export class InvalidPasswordError extends DomainError {
  readonly code = 'INVALID_PASSWORD';
  readonly statusCode = 400;
  readonly isOperational = true;

  constructor() {
    super('Contraseña inválida');
  }
}

export class UnauthorizedError extends DomainError {
  readonly code = 'UNAUTHORIZED';
  readonly statusCode = 401;
  readonly isOperational = true;

  constructor(message: string = 'No autorizado') {
    super(message);
  }
}

export class ForbiddenError extends DomainError {
  readonly code = 'FORBIDDEN';
  readonly statusCode = 403;
  readonly isOperational = true;

  constructor(message: string = 'Acceso denegado') {
    super(message);
  }
}

// Category specific errors
export class CategoryNotFoundError extends DomainError {
  readonly code = 'CATEGORY_NOT_FOUND';
  readonly statusCode = 404;
  readonly isOperational = true;

  constructor(id: string) {
    super(`Categoría con ID ${id} no encontrada`);
  }
}

export class CategoryAlreadyExistsError extends DomainError {
  readonly code = 'CATEGORY_ALREADY_EXISTS';
  readonly statusCode = 409;
  readonly isOperational = true;

  constructor(field: string, value: string) {
    super(`Ya existe una categoría con ${field}: ${value}`);
  }
}

export class CategoryDeletedError extends DomainError {
  readonly code = 'CATEGORY_DELETED';
  readonly statusCode = 410;
  readonly isOperational = true;

  constructor(id: string) {
    super(`No se puede realizar la operación. La categoría con ID ${id} está eliminada`);
  }
}

// VoucherSeries specific errors
export class VoucherSeriesNotFoundError extends DomainError {
  readonly code = 'VOUCHER_SERIES_NOT_FOUND';
  readonly statusCode = 404;
  readonly isOperational = true;

  constructor(id: string) {
    super(`Serie de comprobantes con ID ${id} no encontrada`);
  }
}

export class VoucherSeriesAlreadyExistsError extends DomainError {
  readonly code = 'VOUCHER_SERIES_ALREADY_EXISTS';
  readonly statusCode = 409;
  readonly isOperational = true;

  constructor(field: string, value: string) {
    super(`Ya existe una serie de comprobantes con ${field}: ${value}`);
  }
}