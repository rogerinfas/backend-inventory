import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainError } from '../../application/errors';
import { ErrorResponseDto, ValidationErrorDto } from '../../application/dto/error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let errorResponse: ErrorResponseDto | ValidationErrorDto;
    let status: number;

    if (exception instanceof DomainError) {
      // Errores de dominio personalizados
      status = exception.statusCode;
      errorResponse = {
        code: exception.code,
        message: exception.message,
        statusCode: exception.statusCode,
        timestamp: new Date().toISOString(),
        path: request.url,
        isOperational: exception.isOperational,
      };

      //this.logger.warn(
      //  `Domain Error: ${exception.code} - ${exception.message}`,
      //  exception.stack,
      //);
    } else if (exception instanceof HttpException) {
      // Errores HTTP de NestJS
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
        // Error de validación
        const messages = Array.isArray(exceptionResponse.message)
          ? exceptionResponse.message
          : [exceptionResponse.message];

        errorResponse = {
          code: 'VALIDATION_ERROR',
          message: 'Datos de entrada inválidos',
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          errors: messages,
        };
      } else {
        errorResponse = {
          code: 'HTTP_EXCEPTION',
          message: exception.message,
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          isOperational: true,
        };
      }

      //this.logger.warn(
      //  `HTTP Exception: ${status} - ${exception.message}`,
      //  exception.stack,
      //);
    } else {
      // Errores no controlados
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorResponse = {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error interno del servidor',
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        isOperational: false,
      };

      //this.logger.error(
      //  `Unhandled Exception: ${exception}`,
      //  exception instanceof Error ? exception.stack : undefined,
      //);
    }

    response.status(status).json(errorResponse);
  }
}
