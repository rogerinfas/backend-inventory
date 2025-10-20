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

      // Logs desactivados para errores de dominio
      // this.logger.warn(
      //   `Domain Error: ${exception.code} - ${exception.message}`,
      //   exception.stack,
      // );
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

      // Logs desactivados para errores HTTP
      // this.logger.warn(
      //   `HTTP Exception: ${status} - ${exception.message}`,
      //   exception.stack,
      // );
    } else {
      // Errores no controlados - mejorar el manejo
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      
      // Intentar obtener más información del error
      let errorMessage = 'Error interno del servidor';
      let errorCode = 'INTERNAL_SERVER_ERROR';
      
      if (exception instanceof Error) {
        errorMessage = exception.message || errorMessage;
        errorCode = exception.name || errorCode;
        
        // Log completo del error para debugging (solo para errores críticos)
        // this.logger.error(
        //   `Unhandled Exception: ${exception.name} - ${exception.message}`,
        //   exception.stack,
        // );
      } else {
        // this.logger.error(
        //   `Unhandled Exception (non-Error object): ${JSON.stringify(exception)}`,
        // );
      }

      errorResponse = {
        code: errorCode,
        message: errorMessage,
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        isOperational: false,
      };
    }

    response.status(status).json(errorResponse);
  }
}
