import { CryptoPort } from '~/common/crypto';
import { GeneratorPort } from '~/common/generator';
import { AggregateRoot } from '~/ddd/aggregate-root';

export type UserProps = {
  id: string;
  email: string;
  hashedPassword: string;
  token?: string;
};

export class User extends AggregateRoot<UserProps> {
  get id() {
    return this.props.id;
  }

  async checkPassword(typedPassword: string, crypto: CryptoPort): Promise<boolean> {
    return crypto.compare(typedPassword, this.props.hashedPassword);
  }

  generateToken(generator: GeneratorPort) {
    this.props.token = generator.generateAuthenticationToken();
  }

  async unsetToken() {
    this.props.token = undefined;
  }

  validate(): void {
    //
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
