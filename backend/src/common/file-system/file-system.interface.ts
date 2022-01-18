export abstract class FileSystemPort {
  abstract readJsonFile<T>(path: string): Promise<T>;
  abstract writeFile<T>(path: string, content: T): Promise<void>;
}
