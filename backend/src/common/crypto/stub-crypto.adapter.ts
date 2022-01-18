import { CryptoPort } from './crypto.port';

export class StubCryptoAdapter extends CryptoPort {
  async compare(data: string): Promise<boolean> {
    return data === 'password';
  }
}
