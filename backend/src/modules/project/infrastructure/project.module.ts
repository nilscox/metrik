import { Module } from '@nestjs/common';

import { ConfigModule } from '~/common/config';
import { DateModule } from '~/common/date';
import { GeneratorModule } from '~/common/generator';
import { LoggerModule } from '~/common/logger';

import { ProjectService } from '../domain/project.service';
import { ProjectAggregateModule } from '../project-aggregate';

import { ProjectController } from './project.controller';

@Module({
  imports: [ConfigModule, LoggerModule, GeneratorModule, DateModule, ProjectAggregateModule],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
