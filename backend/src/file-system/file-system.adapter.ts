import fs from 'fs/promises';

import { FileNotFoundError } from './file-not-found.error';
import { FileSystem } from './file-system.interface';

export class FileSystemAdapter implements FileSystem {
  async readJsonFile<T>(path: string): Promise<T> {
    try {
      return JSON.parse(String(await fs.readFile(path)));
    } catch (error) {
      if (error.message.includes('ENOENT')) {
        throw new FileNotFoundError(error);
      }

      throw error;
    }
  }

  async writeFile(path: string, content: string): Promise<void> {
    await fs.writeFile(path, JSON.stringify(content));
  }
}
