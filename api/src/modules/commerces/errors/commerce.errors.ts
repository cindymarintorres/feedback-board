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