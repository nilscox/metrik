import { Module } from '@nestjs/common';

import { cryptoProvider } from './crypto.provider';

@Module({
  providers: [cryptoProvider],
  exports: [cryptoProvider],
})
export class CryptoModule {}
