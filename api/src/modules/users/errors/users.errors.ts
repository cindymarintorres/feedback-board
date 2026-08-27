import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor(id?: string) {
    super(
      id ? `Usuario con ID ${id} no encontrado` : 'Usuario no encontrado',
      HttpStatus.NOT_FOUND,
    );
  }
}

export class EmailAlreadyInUseException extends HttpException {
  constructor() {
    super('El correo ingresado ya se encuentra en uso', HttpStatus.CONFLICT);
  }
}

export class IncorrectPasswordException extends HttpException {
  constructor() {
    super('La contraseña actual es incorrecta', HttpStatus.UNAUTHORIZED);
  }
}

export class UserHasRelatedRecordsException extends BadRequestException {
  constructor(id: string) {
    super(
      `No se puede eliminar el usuario ${id}: tiene reseñas, comercios u otros registros asociados. Desactivalo en su lugar.`,
    );
  }
}