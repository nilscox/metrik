import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Metric, MetricLabel, MetricType } from '~/modules/metric';
import { BaseStore } from '~/sql/base-store';
import { EntityMapper } from '~/sql/entity-mapper';

import { ProjectStore } from '../application/project.store';
import { BranchName } from '../domain/branch-name';
import { Project } from '../domain/project';
import { ProjectName } from '../domain/project-name';

import { MetricOrmEntity } from './metric.orm-entity';
import { ProjectOrmEntity } from './project.orm-entity';

class MetricMapper implements EntityMapper<Metric, MetricOrmEntity> {
  toDomain = (ormEntity: MetricOrmEntity): Metric => {
    return new Metric({
      id: ormEntity.id,
      label: new MetricLabel(ormEntity.label),
      projectId: ormEntity.projectId,
      type: new MetricType(ormEntity.type),
    });
  };

  toOrm = (metric: Metric): MetricOrmEntity => {
    return new MetricOrmEntity({
      id: metric.props.id,
      label: metric.props.label.value,
      type: metric.props.type.value,
    });
  };
}

class ProjectMapper implements EntityMapper<Project, ProjectOrmEntity> {
  private readonly metricMapper = new MetricMapper();

  toDomain = (ormEntity: ProjectOrmEntity): Project => {
    return new Project(
      {
        id: ormEntity.id,
        name: new ProjectName(ormEntity.name),
        defaultBranch: new BranchName(ormEntity.default_branch),
      },
      ormEntity.metrics.map((metricOrmEntity) => this.metricMapper.toDomain(metricOrmEntity)),
    );
  };

  toOrm = (project: Project): ProjectOrmEntity => {
    return new ProjectOrmEntity({
      id: project.props.id,
      name: project.props.name.value,
      default_branch: project.props.defaultBranch.value,
      metrics: project.metrics.map((metric) => this.metricMapper.toOrm(metric)),
    });
  };
}

@Injectable()
export class SqlProjectStore extends BaseStore<Project, ProjectOrmEntity> implements ProjectStore {
  constructor(
    @InjectRepository(ProjectOrmEntity)
    private readonly projectRepository: Repository<ProjectOrmEntity>,
  ) {
    super('project', new ProjectMapper());
  }

  async findById(id: string): Promise<Project | undefined> {
    return this.toDomain(await this.projectRepository.findOne(id));
  }

  async save(projects: Project | Project[]): Promise<void> {
    if (!Array.isArray(projects)) {
      return this.save([projects]);
    }

    await this.projectRepository.save(projects.map((project) => this.toOrm(project)));
  }
}
