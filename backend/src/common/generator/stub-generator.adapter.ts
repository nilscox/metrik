import { GeneratorPort } from './generator.port';

export class StubGeneratorAdapter extends GeneratorPort {
  generateId(): string {
    return 'generated-id';
  }

  generateAuthenticationToken(): string {
    return 'generated-token';
  }
}
