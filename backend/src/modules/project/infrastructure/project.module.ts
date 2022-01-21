import { Module } from '@nestjs/common';

import { ConfigModule } from '~/common/config';
import { DatabaseModule } from '~/common/database/database.module';
import { GeneratorModule } from '~/common/generator';
import { LoggerModule } from '~/common/logger';

import { ProjectService } from '../domain/project.service';

import { ProjectController } from './project.controller';
import { projectStoreProvider } from './project-store/project-store.provider';

@Module({
  imports: [ConfigModule, LoggerModule, GeneratorModule, DatabaseModule],
  controllers: [ProjectController],
  providers: [projectStoreProvider, ProjectService],
})
export class ProjectModule {}
