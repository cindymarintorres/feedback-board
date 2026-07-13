import { NotFoundException, ConflictException } from '@nestjs/common';

export class CommerceNotFoundForReviewException extends NotFoundException {
  constructor(commerceId?: string) {
    super(commerceId ? `Comercio ${commerceId} no encontrado` : 'Comercio no encontrado');
  }
}

export class ReviewAlreadyExistsException extends ConflictException {
  constructor() {
    super('Ya calificaste este comercio, no podés hacerlo dos veces');
  }
}