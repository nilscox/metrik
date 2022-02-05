import { AuthenticationError } from './authentication.error';

export class InvalidCredentialsError extends AuthenticationError {
  constructor() {
    super('invalid email password combinaison');
  }
}
