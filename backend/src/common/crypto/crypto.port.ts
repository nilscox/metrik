export abstract class CryptoPort {
  abstract compare(data: string, encrypted: string): Promise<boolean>;
  abstract encrypt(data: string): Promise<string>;
}
