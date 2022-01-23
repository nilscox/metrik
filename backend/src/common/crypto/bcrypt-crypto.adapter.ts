import bcrypt from 'bcrypt';

import { CryptoPort } from './crypto.port';

export class BcryptCryptoAdapter extends CryptoPort {
  async encrypt(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }

  compare = bcrypt.compare;
}
