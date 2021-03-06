import { FileNotFoundError } from './file-not-found.error';
import { FileSystemPort } from './file-system.port';

export class StubFileSystemAdapter implements FileSystemPort {
  public files = new Map<string, unknown>();

  async readJsonFile<T>(path: string): Promise<T> {
    if (!this.files.has(path)) {
      throw new FileNotFoundError(path);
    }

    return this.files.get(path) as T;
  }

  async writeFile(path: string, content: unknown): Promise<void> {
    await this.files.set(path, content);
  }
}
