import { Response } from 'express';
import { HttpCode } from './constants.error';
import { CustomError } from './custom.error';

class ErrorHandler {
  private isTrustedError(error: Error): boolean {
    if (error instanceof CustomError) {
      return error.isOperational;
    }

    return false;
  }

  public handleError(error: Error | CustomError, response?: Response): void {
    if (this.isTrustedError(error) && response) {
      this.handleTrustedError(error as CustomError, response);
    } else {
      this.handleCriticalError(error, response);
    }
  }

  private handleTrustedError(error: CustomError, response: Response): void {
    response.status(error.httpCode).json({ error: error.name, message: error.message });
  }

  private handleCriticalError(error: Error | CustomError, response?: Response): void {
    if (response) {
      response
        .status(HttpCode.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal server error' });
    }

    // Aqui eu posso lidar com algum outro ponto, tipo mandar um e-mail pra suporte e etc
  }
}

export const errorHandler = new ErrorHandler();