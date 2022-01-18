export abstract class GeneratorPort {
  abstract generateId(): Promise<string>;
  abstract generateAuthenticationToken(): Promise<string>;
}
