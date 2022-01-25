import { useAppSelector } from '~/hooks/useAppSelector';
import { useParam } from '~/hooks/useParam';

import { Metric, selectSnapshots } from '../../../domain';

type SnapshotsTableProps = {
  onMouseOverMetric: (metric: Metric) => void;
};

export const SnapshotsTable: React.FC<SnapshotsTableProps> = ({ onMouseOverMetric }) => {
  const projectId = useParam('projectId');
  const snapshots = useAppSelector(selectSnapshots, projectId);

  return (
    <table className="w-full">
      <thead className=" bg-gray-300/25">
        <tr>
          <th className="p-2 text-left">date</th>
          {snapshots[0].metrics.map(({ label }) => (
            <th key={label} className="p-2 text-left">
              {label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="divide-y">
        {snapshots.map(({ date, metrics }, n) => (
          <tr key={n}>
            <td className="px-2 py-1">
              {date.getFullYear()}-{date.getMonth() + 1}-{date.getDate()}
            </td>
            {metrics.map((metric, n) => (
              <td key={n} className="px-2 py-1" onMouseOver={() => onMouseOverMetric(metric)}>
                {metric.value}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
