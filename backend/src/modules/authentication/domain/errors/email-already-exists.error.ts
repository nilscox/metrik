import { AuthenticationError } from './authentication.error';

export class EmailAlreadyExistsError extends AuthenticationError {
  constructor(public readonly email: string) {
    super(`the email "${email}" already exists in the database`);
  }
}
