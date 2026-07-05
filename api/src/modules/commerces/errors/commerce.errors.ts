import { HttpException, HttpStatus } from '@nestjs/common';

export class CommerceNotFoundException extends HttpException {
  constructor(id?: string) {
    super(
      id ? `Comercio con ID ${id} no encontrado` : 'Comercio no encontrado',
      HttpStatus.NOT_FOUND,
    );
  }
}

export class SlugAlreadyInUseException extends HttpException {
  constructor() {
    super('El slug ingresado ya se encuentra en uso', HttpStatus.CONFLICT);
  }
}

export class CommerceVerificationTokenNotFoundException extends HttpException {
  constructor() {
    super('Token de verificación inválido', HttpStatus.NOT_FOUND);
  }
}

export class CommerceVerificationTokenExpiredException extends HttpException {
  constructor() {
    super('El token de verificación ha expirado', HttpStatus.GONE);
  }
}