import { customAlphabet, nanoid } from 'nanoid';

import { GeneratorPort } from './generator.port';

export class NanoIdGeneratorAdapter extends GeneratorPort {
  async generateId(): Promise<string> {
    return nanoid();
  }

  private tokenGenerator = customAlphabet('abcdefghijklmnopqrstuvwxyz', 16);

  async generateAuthenticationToken(): Promise<string> {
    return this.tokenGenerator();
  }
}
