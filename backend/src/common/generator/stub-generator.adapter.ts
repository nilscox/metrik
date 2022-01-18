import { GeneratorPort } from './generator.port';

export class StubGeneratorAdapter extends GeneratorPort {
  async generateId(): Promise<string> {
    return 'generated-id';
  }

  async generateAuthenticationToken(): Promise<string> {
    return 'generated-token';
  }
}
