import { ValueProvider } from '@nestjs/common';
import bcrypt from 'bcrypt';

import { CryptoPort } from './crypto.port';

export const cryptoProvider: ValueProvider<CryptoPort> = {
  provide: CryptoPort,
  useValue: bcrypt,
};
