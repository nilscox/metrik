import { ClassProvider } from '@nestjs/common';

import { FileSystemAdapter } from './file-system.adapter';
import { FileSystem, FileSystemToken } from './file-system.interface';

export const fileSystemProvider: ClassProvider<FileSystem> = {
  provide: FileSystemToken,
  useClass: FileSystemAdapter,
};
