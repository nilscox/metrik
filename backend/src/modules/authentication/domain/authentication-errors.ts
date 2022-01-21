export class AuthenticationError extends Error {}

export class InvalidCredentialsError extends AuthenticationError {
  constructor() {
    super('invalid email password combinaison');
  }
}
