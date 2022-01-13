import bcrypt from 'bcrypt';
import * as uuid from 'uuid';

import { AuthenticationError } from './authentication-error';

export type UserProps = {
  id: string;
  email: string;
  hashedPassword: string;
  token?: string;
};

// todo: abstract bcrypt & uuid?
export class User {
  // todo: private
  constructor(public props: UserProps) {}

  async authenticate(typedPassword: string) {
    const result = await bcrypt.compare(
      typedPassword,
      this.props.hashedPassword,
    );

    if (!result) {
      throw new AuthenticationError('invalid email password combinaison');
    }

    this.props.token = uuid.v4();
  }
}

export const createUser = (overrides: Partial<UserProps> = {}): User => {
  return new User({
    id: '1',
    email: 'user@domain.tld',
    hashedPassword: 'hashedPassword',
    ...overrides,
  });
};
