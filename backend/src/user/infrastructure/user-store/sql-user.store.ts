import db from '~/sql/database';

import { User } from '../../domain/user';
import { UserStore } from '../../domain/user.store';

export class SqlUserStore implements UserStore {
  async findUserByEmail(email: string): Promise<User> {
    const row = await db
      .selectFrom('user')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirstOrThrow();

    return new User({
      id: row.id,
      email: row.email,
      hashedPassword: row.hashedPassword,
      token: row.token ?? undefined,
    });
  }

  async findUserByToken(token: string): Promise<User> {
    const row = await db
      .selectFrom('user')
      .selectAll()
      .where('token', '=', token)
      .executeTakeFirstOrThrow();

    return new User({
      id: row.id,
      email: row.email,
      hashedPassword: row.hashedPassword,
      token: row.token ?? undefined,
    });
  }

  async saveUser(user: User): Promise<void> {
    if (await this.exists(user.id)) {
      await db.updateTable('user').set(user.getProps()).execute();
    } else {
      await db.insertInto('user').values(user.getProps()).execute();
    }
  }

  private async exists(userId: string): Promise<boolean> {
    const { count } = db.fn;

    const result = await db
      .selectFrom('user')
      .select(count('id').as('count'))
      .where('id', '=', userId)
      .executeTakeFirstOrThrow();

    return result.count === 1;
  }
}
