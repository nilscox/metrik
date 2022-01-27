## Metrik backend

Use cases:

- create a project
- add metric configurations to a project
- add a snapshot of metrics values
- query the last snapshots
- query a diff between two snapshots
- add threshold alerts to a metric
- be notified when a metric gets above or below a threshold
- add objectives to a metric
- be notified periodically of an objective's progress

Entities:

```
Project
  - defaultBranch: string
  - metrics: Metric[]
  - snapshots: Snapshot[]
  - objectives: MetricObjective[]
  - alerts: MetricThresholdAlert[]
```

```
Metric
  - label: string
  - objective: MetricObjective
  - type: 'number' | 'duration' | 'percentage' | 'rate'
```

```
Snapshot
  - branch: string
  - commit: string
  - date: Date
  - metrics: Metric[]
```

```
MetricValue
  - metric: Metric
  - value: number
```

```
ThresholdAlert
  - metric: Metric
  - threshold: number
  - activeWhen: 'above' | 'below'
```

```
SnapshotDiff
  - snapshot1: Snapshot
  - snapshot2: Snapshot
  - diff: MetricsDiff[]
```

```
MetricsDiff
  - metric: Metric
  - value: number
```

```
Objective
  - label: string
  - description: string
  - metric: Metric
  - deadline: Date
  - target: number
  - progress: ObjectiveProgress
```

```
ObjectiveProgress
  - remainingTime: Duration
  - currentTarget: number
  - expectedTarget: number
```
