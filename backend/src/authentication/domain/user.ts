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
}

export const createUser = (overrides: Partial<UserProps> = {}): User => {
  return new User({
    id: '1',
    email: 'user@domain.tld',
    hashedPassword: 'hashedPassword',
    ...overrides,
  });
};
