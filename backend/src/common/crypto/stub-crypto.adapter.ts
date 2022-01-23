import { CryptoPort } from './crypto.port';

export class StubCryptoAdapter extends CryptoPort {
  async encrypt(data: string): Promise<string> {
    return data + '-encrypted';
  }

  async compare(data: string): Promise<boolean> {
    return data === 'password';
  }
}
