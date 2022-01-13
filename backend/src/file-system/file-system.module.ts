import { Module } from '@nestjs/common';

import { fileSystemProvider } from './files-system.provider';

@Module({
  providers: [fileSystemProvider],
  exports: [fileSystemProvider],
})
export class FileSystemModule {}
