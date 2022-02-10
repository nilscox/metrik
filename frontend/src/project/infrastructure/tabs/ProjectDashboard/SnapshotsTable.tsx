import { format } from 'date-fns';

import { useAppSelector } from '~/hooks/useAppSelector';
import { useParam } from '~/hooks/useParam';
import { AppSelector } from '~/store';

import { MetricValue, selectMetricLabel, selectProject, selectSnapshots } from '../../../domain';

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type MetricValueVM = Optional<MetricValue, 'value'>;

type SnapshotsVM = {
  columns: Array<{ metricId: string; label: string }>;
  values: Array<{ date: string; metrics: Array<MetricValueVM> }>;
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
      return (
        snapshot.metrics.find((metric) => metric.metricId === metricId) ?? {
          metricId,
        }
      );
    }),
  }));

  return {
    columns,
    values,
  };
};

type SnapshotsTableProps = {
  onMouseOverMetric: (metricId: string) => void;
};

export const SnapshotsTable: React.FC<SnapshotsTableProps> = ({ onMouseOverMetric }) => {
  const projectId = useParam('projectId');
  const snapshots = useAppSelector(selectSnapshotsVM, projectId);

  return (
    <table className="w-full">
      <thead className=" bg-light/25">
        <tr>
          <th className="p-2 text-left">date</th>
          {snapshots.columns.map(({ metricId, label }) => (
            <th key={metricId} className="p-2 text-left">
              {label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="divide-y divide-light">
        {snapshots.values.map(({ date, metrics }, n) => (
          <tr key={n}>
            <td className="px-2 py-1">{date}</td>
            {metrics.map((metric, n) => (
              <MetricValueTableCell
                key={metric?.metricId ?? n}
                metric={metric}
                onMouseOver={() => onMouseOverMetric(metric.metricId)}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

type MetricValueProps = {
  metric: MetricValueVM;
  onMouseOver: () => void;
};

export const MetricValueTableCell: React.FC<MetricValueProps> = ({ metric, onMouseOver }) => {
  return (
    <td key={metric.metricId} className="px-2 py-1" onMouseOver={onMouseOver}>
      {metric.value ?? '-'}
    </td>
  );
};
