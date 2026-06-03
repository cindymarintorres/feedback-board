import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidCredentialsException extends HttpException {
  constructor() {
    super('Credenciales inválidas', HttpStatus.UNAUTHORIZED);
  }
}

export class InvalidTokenException extends HttpException {
  constructor() {
    super('Token inválido', HttpStatus.BAD_REQUEST);
  }
}

export class ExpiredTokenException extends HttpException {
  constructor() {
    super('El token expiró, solicita uno nuevo', HttpStatus.BAD_REQUEST);
  }
}