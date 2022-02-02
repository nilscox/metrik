import { CryptoPort } from '~/common/crypto';
import { GeneratorPort } from '~/common/generator';
import { Entity } from '~/ddd/entity';

export type UserProps = {
  id: string;
  email: string;
  hashedPassword: string;
  token?: string;
};

export class User extends Entity<UserProps> {
  get id() {
    return this.props.id;
  }

  getProps() {
    return this.props;
  }

  async checkPassword(typedPassword: string, crypto: CryptoPort): Promise<boolean> {
    return crypto.compare(typedPassword, this.props.hashedPassword);
  }

  async generateToken(generator: GeneratorPort) {
    this.props.token = await generator.generateAuthenticationToken();
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
