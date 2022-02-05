import { format } from 'date-fns';

import { useAppSelector } from '~/hooks/useAppSelector';
import { useParam } from '~/hooks/useParam';
import { AppSelector } from '~/store';

import { MetricValue, selectMetricLabel, selectProject, selectSnapshots } from '../../../domain';

type SnapshotsVM = {
  columns: Array<{ metricId: string; label: string }>;
  values: Array<{ date: string; metrics: Array<MetricValue> }>;
};

const selectSnapshotsVM: AppSelector<SnapshotsVM, [string]> = (state, projectId) => {
  const project = selectProject(state, projectId);
  const snapshots = selectSnapshots(state, projectId);

  const columns: SnapshotsVM['columns'] = project.metrics.map(({ id: metricId }) => ({
    metricId,
    label: selectMetricLabel(state, projectId, metricId) as string,
  }));

  const values: SnapshotsVM['values'] = snapshots.map((snapshot) => ({
    date: format(snapshot.date, 'yyyy-MM-dd HH:mm'),
    metrics: columns.map(({ metricId }) => {
      return snapshot.metrics.find((metric) => metric.metricId === metricId) as MetricValue;
    }),
  }));

  return {
    columns,
    values,
  };
};

type SnapshotsTableProps = {
  onMouseOverMetric: (metric: MetricValue) => void;
};

export const SnapshotsTable: React.FC<SnapshotsTableProps> = ({ onMouseOverMetric }) => {
  const projectId = useParam('projectId');
  const snapshots = useAppSelector(selectSnapshotsVM, projectId);

  return (
    <table className="w-full">
      <thead className=" bg-gray-300/25">
        <tr>
          <th className="p-2 text-left">date</th>
          {snapshots.columns.map(({ metricId, label }) => (
            <th key={metricId} className="p-2 text-left">
              {label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="divide-y">
        {snapshots.values.map(({ date, metrics }, n) => (
          <tr key={n}>
            <td className="px-2 py-1">{date}</td>
            {metrics.map((metric) => (
              <td key={metric.metricId} className="px-2 py-1" onMouseOver={() => onMouseOverMetric(metric)}>
                {metric.value}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
