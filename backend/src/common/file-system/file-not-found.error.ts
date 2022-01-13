export class FileNotFoundError extends Error {
  constructor(readonly path: string) {
    super(`file not found '${path}'`);
  }
}
