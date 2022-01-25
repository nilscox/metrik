import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

import { useAppSelector } from '~/hooks/useAppSelector';
import { useParam } from '~/hooks/useParam';

import { selectSnapshots } from '../../../domain';

type SnapshotsChartProps = {
  metricLabel: string;
};

export const SnapshotsChart: React.FC<SnapshotsChartProps> = ({ metricLabel }) => {
  const projectId = useParam('projectId');
  const snapshots = useAppSelector(selectSnapshots, projectId);

  const values = snapshots.map((snapshot) => ({
    date: [snapshot.date.getMonth() + 1, snapshot.date.getDate()].join('-'),
    ...snapshot.metrics.reduce(
      (obj, { label, value }) => ({ ...obj, [label]: value }),
      {} as Record<string, number>,
    ),
  }));

  return (
    <div className="flex flex-col items-center gap-2">
      <strong>{metricLabel}</strong>
      <LineChart width={460} height={240} data={values}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis type="number" domain={['auto', 'auto']} />
        <Line type="monotone" dataKey={metricLabel} stroke="#8884d8" animationDuration={180} />
        <Tooltip />
      </LineChart>
    </div>
  );
};
