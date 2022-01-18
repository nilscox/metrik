import { Module } from '@nestjs/common';

import { generatorProvider } from './generator.provider';

@Module({
  providers: [generatorProvider],
  exports: [generatorProvider],
})
export class GeneratorModule {}
