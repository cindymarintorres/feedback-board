import { HttpException, HttpStatus } from '@nestjs/common'

export class SuggestionNotFoundException extends HttpException {
  constructor(id?: string) {
    super(
      id ? `Sugerencia con id ${id} no encontrada` : 'Sugerencia no encontrada',
      HttpStatus.NOT_FOUND,
    )
  }
}

export class CommerceNotFoundForSuggestionException extends HttpException {
  constructor(commerceId: string) {
    super(
      `Comercio con id ${commerceId} no encontrado`,
      HttpStatus.NOT_FOUND,
    )
  }
}