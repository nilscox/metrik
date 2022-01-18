import { ClassProvider } from '@nestjs/common';

import { FileSystemAdapter } from './file-system.adapter';
import { FileSystemPort } from './file-system.interface';

export const fileSystemProvider: ClassProvider<FileSystemPort> = {
  provide: FileSystemPort,
  useClass: FileSystemAdapter,
};
