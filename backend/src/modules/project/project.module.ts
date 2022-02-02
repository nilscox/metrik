import { Module } from '@nestjs/common';

import { DatabaseModule } from '~/common/database';
import { GeneratorModule } from '~/common/generator';

import { ProjectService } from './application/project.service';
import { projectStoreProvider } from './persistence/project-store.provider';
import { ProjectController } from './project.controller';

@Module({
  imports: [GeneratorModule, DatabaseModule],
  controllers: [ProjectController],
  providers: [projectStoreProvider, ProjectService],
  exports: [projectStoreProvider],
})
export class ProjectModule {}
