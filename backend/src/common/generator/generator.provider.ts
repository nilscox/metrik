import { ClassProvider } from '@nestjs/common';

import { GeneratorPort } from './generator.port';
import { NanoIdGeneratorAdapter } from './nanoid-generator.adapter';

export const generatorProvider: ClassProvider<GeneratorPort> = {
  provide: GeneratorPort,
  useClass: NanoIdGeneratorAdapter,
};
