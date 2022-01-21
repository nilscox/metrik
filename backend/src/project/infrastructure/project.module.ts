import { Module } from '@nestjs/common';

import { ConfigModule } from '../../common/config/config.module';
import { GeneratorModule } from '../../common/generator/generator.module';
import { LoggerModule } from '../../common/logger/logger.module';
import { ProjectService } from '../domain/project.service';

import { ProjectController } from './project.controller';
import { projectStoreProvider } from './project-store/project-store.provider';

@Module({
  imports: [ConfigModule, LoggerModule, GeneratorModule],
  controllers: [ProjectController],
  providers: [projectStoreProvider, ProjectService],
})
export class ProjectModule {}
