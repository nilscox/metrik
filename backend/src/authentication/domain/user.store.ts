import { User } from './user';

export interface UserStore {
  findUserByEmail(email: string): Promise<User | undefined>;
  findUserByToken(token: string): Promise<User | undefined>;
  saveUser(user: User): Promise<void>;
}
