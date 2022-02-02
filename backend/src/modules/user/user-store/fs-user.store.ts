import { Injectable } from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';

import { FileNotFoundError, FileSystemPort } from '~/common/file-system';

import { User, UserProps } from '../domain/user';

import { UserStore } from './user.store';

@Injectable()
export class FsUserStore implements UserStore {
  constructor(private readonly fs: FileSystemPort) {}

  findById(id: string): Promise<User | undefined> {
    return this.findUserByPredicate((user) => user.id === id);
  }

  async findByIdOrFail(id: string): Promise<User> {
    const entity = await this.findUserByPredicate((user) => user.id === id);

    if (!entity) {
      throw new EntityNotFoundError('user', { id });
    }

    return entity;
  }

  async exists(id: string): Promise<boolean> {
    return (await this.findById(id)) !== undefined;
  }

  findByEmail(email: string): Promise<User | undefined> {
    return this.findUserByPredicate((user) => user.email === email);
  }

  findByToken(token: string): Promise<User | undefined> {
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

  async save(user: User): Promise<void> {
    const users = await this.getUsers();
    const idx = users.findIndex(({ id }) => id === user.id);

    if (idx < 0) {
      users.push(user.props);
    } else {
      users[idx] = user.props;
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
