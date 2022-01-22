import { Injectable } from '@nestjs/common';

import { FileNotFoundError, FileSystemPort } from '~/common/file-system';

import { User } from '../..';
import { UserProps } from '../../domain/user';
import { UserStore } from '../../domain/user.store';

@Injectable()
export class FsUserStore implements UserStore {
  constructor(private readonly fs: FileSystemPort) {}

  findUserByEmail(email: string): Promise<User | undefined> {
    return this.findUserByPredicate((user) => user.email === email);
  }

  findUserByToken(token: string): Promise<User | undefined> {
    return this.findUserByPredicate((user) => user.token === token);
  }

  private async findUserByPredicate(
    predicate: (user: UserProps) => boolean,
  ): Promise<User | undefined> {
    const users: UserProps[] = await this.getUsers();
    const props = users.find(predicate);

    if (props) {
      return new User(props);
    }
  }

  async saveUser(user: User): Promise<void> {
    const users = await this.getUsers();
    const idx = users.findIndex(({ id }) => id === user.id);

    if (idx < 0) {
      users.push(user.getProps());
    } else {
      users[idx] = user.getProps();
    }

    await this.fs.writeFile('db.json', users);
  }

  private async getUsers(): Promise<UserProps[]> {
    try {
      return await this.fs.readJsonFile('db.json');
    } catch (error) {
      if (!(error instanceof FileNotFoundError)) {
        throw error;
      }

      await this.fs.writeFile('db.json', []);

      return [];
    }
  }
}
