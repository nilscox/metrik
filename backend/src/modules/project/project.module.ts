import { Module } from '@nestjs/common';

import { ConfigModule } from '~/common/config';
import { DatabaseModule } from '~/common/database';
import { GeneratorModule } from '~/common/generator';
import { BranchModule } from '~/modules/branch';

import { ProjectService } from './application/project.service';
import { projectStoreProvider } from './persistence/project.store.provider';
import { ProjectController } from './project.controller';

@Module({
  imports: [ConfigModule, GeneratorModule, DatabaseModule, BranchModule],
  controllers: [ProjectController],
  providers: [projectStoreProvider, ProjectService],
  exports: [projectStoreProvider],
})
export class ProjectModule {}
