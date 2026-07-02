import { HttpException, HttpStatus } from '@nestjs/common'

export class VoteAlreadyExistsException extends HttpException {
  constructor() {
    super('Ya has votado en esta sugerencia', HttpStatus.CONFLICT)
  }
}

export class VoteNotFoundException extends HttpException {
  constructor() {
    super('No tienes un voto registrado en esta sugerencia', HttpStatus.NOT_FOUND)
  }
}

export class SuggestionNotFoundForVoteException extends HttpException {
  constructor(suggestionId: string) {
    super(
      `Sugerencia con id ${suggestionId} no encontrada`,
      HttpStatus.NOT_FOUND,
    )
  }
}