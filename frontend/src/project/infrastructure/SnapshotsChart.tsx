import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts';

import { MetricsSnapshot } from '../domain/project.slice';

type SnapshotsChartProps = {
  snapshots: MetricsSnapshot[];
  metricLabel: string;
};

export const SnapshotsChart: React.FC<SnapshotsChartProps> = ({ snapshots, metricLabel }) => {
  const values = snapshots.map((snapshot) =>
    snapshot.metrics.reduce(
      (obj, { label, value }) => ({ ...obj, [label]: value }),
      {} as Record<string, number>,
    ),
  );

  return (
    <LineChart width={260} height={180} data={values}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Line type="monotone" dataKey={metricLabel} stroke="#8884d8" />
    </LineChart>
  );
};
