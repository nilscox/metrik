import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

import { BranchMapper } from '~/modules/branch';
import { Metric, MetricLabel, MetricType } from '~/modules/metric';
import { BaseStore } from '~/sql/base-store';
import { BranchOrmEntity, MetricOrmEntity, ProjectOrmEntity } from '~/sql/entities';
import { EntityMapper } from '~/sql/entity-mapper';

import { ProjectStore } from '../application/project.store';
import { Project } from '../domain/project';
import { ProjectName } from '../domain/project-name';

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
  private readonly branchMapper = new BranchMapper();

  toDomain = (ormEntity: ProjectOrmEntity): Project => {
    return new Project({
      id: ormEntity.id,
      name: new ProjectName(ormEntity.name),
      defaultBranch: this.branchMapper.toDomain(ormEntity.defaultBranch),
      metrics: ormEntity.metrics.map((metricOrmEntity) =>
        this.metricMapper.toDomain(metricOrmEntity),
      ),
    });
  };

  toOrm = (project: Project): ProjectOrmEntity => {
    return new ProjectOrmEntity({
      id: project.props.id,
      name: project.props.name.value,
      defaultBranch: this.branchMapper.toOrm(project.props.defaultBranch),
      metrics: project.props.metrics.map((metric) => this.metricMapper.toOrm(metric)),
    });
  };
}

@Injectable()
export class SqlProjectStore extends BaseStore<Project, ProjectOrmEntity> implements ProjectStore {
  constructor(private readonly connection: Connection) {
    super('project', connection.getRepository(ProjectOrmEntity), new ProjectMapper());
  }

  async insert(project: Project): Promise<void> {
    await this.connection.transaction(async (manager) => {
      const projectOrmEntity = this.toOrm(project);
      const defaultBranchOrmEntity = projectOrmEntity.defaultBranch as BranchOrmEntity;

      // @ts-expect-error avoid circular dependency
      projectOrmEntity.defaultBranch = null;

      await manager.insert(ProjectOrmEntity, projectOrmEntity);
      await manager.insert(BranchOrmEntity, defaultBranchOrmEntity);

      projectOrmEntity.defaultBranch = defaultBranchOrmEntity;
      await manager.save(ProjectOrmEntity, projectOrmEntity);
    });
  }
}
