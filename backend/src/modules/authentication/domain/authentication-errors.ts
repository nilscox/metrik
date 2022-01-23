export class AuthenticationError extends Error {}

export class InvalidCredentialsError extends AuthenticationError {
  constructor() {
    super('invalid email password combinaison');
  }
}

export class EmailAlreadyExistsError extends AuthenticationError {
  constructor(public readonly email: string) {
    super(`the email "${email}" already exists in the database`);
  }
}
