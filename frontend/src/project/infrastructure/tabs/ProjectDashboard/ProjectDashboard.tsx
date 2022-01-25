import { useState } from 'react';

import { useAppSelector } from '~/hooks/useAppSelector';
import { useParam } from '~/hooks/useParam';

import { Metric, selectLastSnapshot } from '../../../domain';

import { Metric as MetricComponent } from './Metric';
import { SnapshotsChart } from './SnapshotsChart';
import { SnapshotsTable } from './SnapshotsTable';

export const ProjectDashboard: React.FC = () => {
  const projectId = useParam('projectId');
  const lastSnapshot = useAppSelector(selectLastSnapshot, projectId);

  const [label, setLabel] = useState('lines of code');

  const handleMouseOverMetric = (metric: Metric) => {
    setLabel(metric.label);
  };

  return (
    <>
      <div className="flex flex-row justify-evenly">
        {lastSnapshot.metrics.map((metric, n) => (
          <MetricComponent
            key={n}
            projectId={projectId}
            onMouseOver={() => handleMouseOverMetric(metric)}
            {...metric}
          />
        ))}
      </div>

      <div className="flex flex-row gap-4">
        <SnapshotsTable onMouseOverMetric={handleMouseOverMetric} />
        <SnapshotsChart metricLabel={label} />
      </div>
    </>
  );
};
