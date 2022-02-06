import { customAlphabet } from 'nanoid';

import { GeneratorPort } from './generator.port';

export class NanoIdGeneratorAdapter extends GeneratorPort {
  private idGenerator = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10);

  generateId(): string {
    return this.idGenerator();
  }

  private tokenGenerator = customAlphabet('abcdefghijklmnopqrstuvwxyz', 24);

  generateAuthenticationToken(): string {
    return this.tokenGenerator();
  }
}
