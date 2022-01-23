import { Database, UserTable } from '~/sql/database';

import { User, UserProps } from '../../domain/user';
import { UserStore } from '../../domain/user.store';

export class SqlUserStore implements UserStore {
  constructor(private db: Database) {}

  async findUserByEmail(email: string): Promise<User | undefined> {
    const row = await this.db
      .selectFrom('user')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();

    if (!row) {
      return;
    }

    return new User({
      id: row.id,
      email: row.email,
      hashedPassword: row.hashedPassword,
      token: row.token ?? undefined,
    });
  }

  async findUserByToken(token: string): Promise<User | undefined> {
    const row = await this.db
      .selectFrom('user')
      .selectAll()
      .where('token', '=', token)
      .executeTakeFirst();

    if (!row) {
      return;
    }

    return new User({
      id: row.id,
      email: row.email,
      hashedPassword: row.hashedPassword,
      token: row.token ?? undefined,
    });
  }

  async saveUser(user: User): Promise<void> {
    const record = this.toStoreEntity(user);

    if (await this.exists(user.id)) {
      await this.db.updateTable('user').set(record).execute();
    } else {
      await this.db.insertInto('user').values(record).execute();
    }
  }

  private toStoreEntity(user: User): UserTable {
    const props = user.getProps();

    return {
      id: props.id,
      email: props.email,
      hashedPassword: props.hashedPassword,
      token: props.token ?? null,
    };
  }

  private async exists(userId: string): Promise<boolean> {
    const { count } = this.db.fn;

    const result = await this.db
      .selectFrom('user')
      .select(count('id').as('count'))
      .where('id', '=', userId)
      .executeTakeFirstOrThrow();

    return result.count === 1;
  }
}
