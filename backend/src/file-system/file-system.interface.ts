export const FileSystemToken = Symbol('FileSystemToken');

export interface FileSystem {
  readJsonFile<T>(path: string): Promise<T>;
  writeFile(path: string, content: any): Promise<void>;
}
