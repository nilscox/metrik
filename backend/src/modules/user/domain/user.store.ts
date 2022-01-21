import { User } from './user';

export const UserStoreToken = Symbol('UserStoreToken');

export interface UserStore {
  findUserByEmail(email: string): Promise<User | undefined>;
  findUserByToken(token: string): Promise<User | undefined>;
  saveUser(user: User): Promise<void>;
}
