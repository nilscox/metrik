import { useState } from 'react';

import { useAppSelector } from '~/hooks/useAppSelector';
import { useParam } from '~/hooks/useParam';
import { selectLastSnapshot } from '~/project/domain';

import { Metric as MetricComponent } from './Metric';
import { SnapshotsChart } from './SnapshotsChart';
import { SnapshotsTable } from './SnapshotsTable';

export const ProjectDashboard: React.FC = () => {
  const projectId = useParam('projectId');
  const lastSnapshot = useAppSelector(selectLastSnapshot, projectId);

  const [metricId, setMetricId] = useState(lastSnapshot.metrics[0].metricId);

  return (
    <>
      <div className="flex flex-row justify-evenly">
        {lastSnapshot.metrics.map((metric, n) => (
          <MetricComponent
            key={n}
            projectId={projectId}
            onMouseOver={() => setMetricId(metric.metricId)}
            {...metric}
          />
        ))}
      </div>

      <div className="flex flex-row gap-4">
        <SnapshotsTable onMouseOverMetric={setMetricId} />
        <SnapshotsChart metricId={metricId} />
      </div>
    </>
  );
};
