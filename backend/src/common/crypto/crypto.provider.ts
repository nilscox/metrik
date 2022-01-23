import { ClassProvider } from '@nestjs/common';

import { BcryptCryptoAdapter } from './bcrypt-crypto.adapter';
import { CryptoPort } from './crypto.port';

export const cryptoProvider: ClassProvider<CryptoPort> = {
  provide: CryptoPort,
  useClass: BcryptCryptoAdapter,
};
