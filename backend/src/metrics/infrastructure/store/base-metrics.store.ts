import {
  Metric,
  MetricsSnapshot,
  MetricsSnapshots,
} from '../../domain/Metrics';

export type MetricData = {
  key: string;
  value: number;
};

export type MetricsSnapshotData = {
  id: string;
  date: string;
  metrics: MetricData[];
};

export type MetricsSnapshotsData = MetricsSnapshotData[];

export abstract class BaseMetricsStore {
  protected instantiateMetricsSnapshots(snapshots: MetricsSnapshotsData) {
    return new MetricsSnapshots(
      snapshots.map(this.instantiateMetricsSnapshot.bind(this)),
    );
  }

  protected instantiateMetricsSnapshot(snapshot: MetricsSnapshotData) {
    return new MetricsSnapshot(
      snapshot.id,
      new Date(snapshot.date),
      snapshot.metrics.map(({ key, value }) => new Metric(key, value)),
    );
  }

  protected serializeMetricsSnapshots(
    snapshots: MetricsSnapshots,
  ): MetricsSnapshotsData {
    return snapshots.snapshots.map(this.serializeMetricsSnapshot.bind(this));
  }

  protected serializeMetricsSnapshot(
    snapshot: MetricsSnapshot,
  ): MetricsSnapshotData {
    return {
      id: snapshot.id,
      date: snapshot.date.toISOString(),
      metrics: snapshot.metrics.map((metric) => ({
        key: metric.key,
        value: metric.value,
      })),
    };
  }
}
