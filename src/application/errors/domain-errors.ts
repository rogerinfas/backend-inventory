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
