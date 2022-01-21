import { CryptoPort } from '../../common/crypto/crypto.port';
import { GeneratorPort } from '../../common/generator/generator.port';
import { Entity } from '../../ddd/entity';

export type UserProps = {
  id: string;
  email: string;
  hashedPassword: string;
  token?: string;
};

export class User extends Entity {
  constructor(private props: UserProps) {
    super();
  }

  get id() {
    return this.props.id;
  }

  getProps() {
    return this.props;
  }

  async checkPassword(
    typedPassword: string,
    crypto: CryptoPort,
  ): Promise<boolean> {
    return crypto.compare(typedPassword, this.props.hashedPassword);
  }

  async generateToken(generator: GeneratorPort) {
    this.props.token = await generator.generateAuthenticationToken();
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
