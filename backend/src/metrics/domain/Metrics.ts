export class Metric {
  constructor(readonly key: string, readonly value: number) {}
}

export interface MetricsStore {
  getSnapshots(): Promise<MetricsSnapshots>;
  saveSnapshots(snapshots: MetricsSnapshots);
}

export class MetricsSnapshot {
  constructor(
    readonly id: string,
    readonly date: Date,
    readonly metrics: Metric[],
  ) {}
}

const randomId = () => Math.random().toString(36).slice(-6);

export class MetricsSnapshots {
  constructor(readonly snapshots: MetricsSnapshot[]) {}

  getLast() {
    return this.snapshots[this.snapshots.length - 1];
  }

  createSnapshot(date: Date, metrics: Record<string, number>) {
    const snapshot = new MetricsSnapshot(
      randomId(),
      date,
      Object.entries(metrics).map(([key, value]) => new Metric(key, value)),
    );

    this.snapshots.push(snapshot);

    return snapshot;
  }
}
