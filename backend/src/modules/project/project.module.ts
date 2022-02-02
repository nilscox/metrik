import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseModule } from '~/common/database';
import { GeneratorModule } from '~/common/generator';

import { ProjectService } from './application/project.service';
import { MetricOrmEntity } from './persistence/metric.orm-entity';
import { ProjectOrmEntity } from './persistence/project.orm-entity';
import { projectStoreProvider } from './persistence/project.store.provider';
import { ProjectController } from './project.controller';

@Module({
  imports: [
    GeneratorModule,
    DatabaseModule,
    TypeOrmModule.forFeature([ProjectOrmEntity, MetricOrmEntity]),
  ],
  controllers: [ProjectController],
  providers: [projectStoreProvider, ProjectService],
  exports: [projectStoreProvider],
})
export class ProjectModule {}
