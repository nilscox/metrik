import { User, UserProps } from '../../../authentication/domain/user';
import { UserStore } from '../../../authentication/domain/user.store';
import { InMemoryStore } from '../../../common/utils/in-memory.store';

export class InMemoryUserStore extends InMemoryStore<UserProps> implements UserStore {
  async findUserById(id: string): Promise<User | undefined> {
    return this.findByPredicate((props) => props.id === id);
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.findByPredicate((props) => props.email === email);
  }

  async findUserByToken(token: string): Promise<User | undefined> {
    return this.findByPredicate((props) => props.token === token);
  }

  private findByPredicate(predicate: (props: UserProps) => boolean): User | undefined {
    const props = this.find(predicate);

    if (props) {
      return new User(props);
    }
  }

  async saveUser(user: User): Promise<void> {
    this.add(user.getProps());
  }
}
