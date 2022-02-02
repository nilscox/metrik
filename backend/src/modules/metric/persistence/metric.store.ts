import { Inject } from '@nestjs/common';

import { DatabaseToken } from '~/common/database';
import { Database, MetricTable } from '~/sql/database';

import { Metric } from '../domain/metric';

import { MetricStorePort } from './metric.store.port';

export class MetricStore implements MetricStorePort {
  constructor(@Inject(DatabaseToken) private readonly db: Database) {}

  async save(metric: Metric): Promise<void> {
    const { count } = await this.db
      .selectFrom('metric')
      .select(this.db.fn.count('id').as('count'))
      .where('id', '=', metric.props.id)
      .executeTakeFirstOrThrow();

    const props: MetricTable = {
      id: metric.props.id,
      label: metric.props.label.value,
      type: metric.props.type.value,
      project_id: metric.props.projectId,
    };

    // prettier-ignore
    if (count === 0) {
      await this.db
        .insertInto('metric')
        .values(props)
        .execute();
    } else {
      await this.db
        .updateTable('metric')
        .set(props)
        .where('id', '=', metric.props.id)
        .execute();
    }
  }
}
