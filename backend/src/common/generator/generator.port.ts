export abstract class GeneratorPort {
  abstract generateId(): string;
  abstract generateAuthenticationToken(): string;
}
