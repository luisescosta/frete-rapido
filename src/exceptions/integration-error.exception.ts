import { HttpStatus } from '@nestjs/common';

export class IntegrationErrorException extends Error {
  public statusCode: number;
  constructor() {
    super('Frete-rapido integration error');
    this.statusCode = HttpStatus.NOT_FOUND;
  }
}
