import { User, UserProps } from '../../domain/user';
import { UserStore } from '../../domain/user.store';

const clone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

export class InMemoryUserStore implements UserStore {
  users = new Map<string, UserProps>();

  add(user: User) {
    this.users.set(user.props.id, user.props);
  }

  async findUserById(id: string): Promise<User | undefined> {
    if (!this.users.has(id)) {
      return;
    }

    return new User(clone(this.users.get(id)));
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.findUserByPredicate((props) => props.email === email);
  }

  async findUserByToken(token: string): Promise<User | undefined> {
    return this.findUserByPredicate((props) => props.token === token);
  }

  private findUserByPredicate(
    predicate: (props: UserProps) => boolean,
  ): User | undefined {
    const props = Array.from(this.users.values()).find(predicate);

    if (!props) {
      return;
    }

    return new User(clone(props));
  }

  async saveUser(user: User): Promise<void> {
    this.users.set(user.props.id, clone(user.props));
  }
}
