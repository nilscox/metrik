import { useState } from 'react';

import { useParams } from 'react-router-dom';
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

import { useAppSelector } from '../../../hooks/useAppSelector';
import { Metric, selectMetricUnitDisplayValue } from '../../domain/project.slice';
import { selectLastSnapshot, selectSnapshots } from '../../domain/selectors/selectSnapshots/selectSnapshots';

export const ProjectDashboard: React.FC = () => {
  const { projectId } = useParams();
  const lastSnapshot = useAppSelector(selectLastSnapshot, projectId);

  const [label, setLabel] = useState('lines of code');

  const handleMouseOverMetric = (metric: Metric) => {
    setLabel(metric.label);
  };

  return (
    <>
      <div className="flex flex-row justify-evenly">
        {lastSnapshot.metrics.map((metric, n) => (
          <Metric
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

type MetricProps = {
  projectId: string;
  label: string;
  value: number;
  onMouseOver: () => void;
};

const Metric: React.FC<MetricProps> = ({ projectId, label, value, onMouseOver }) => {
  const unit = useAppSelector(selectMetricUnitDisplayValue, projectId, label);

  return (
    <div
      className="flex flex-col items-center justify-center my-12"
      style={{ width: 160, height: 160 }}
      onMouseOver={onMouseOver}
    >
      <div className="flex items-baseline">
        <span className="text-5xl font-semibold">{value}</span>
        <span className="ml-1 text-2xl">{unit}</span>
      </div>
      <div className="mt-4 text-gray-600">{label}</div>
    </div>
  );
};

type SnapshotsTableProps = {
  onMouseOverMetric: (metric: Metric) => void;
};

const SnapshotsTable: React.FC<SnapshotsTableProps> = ({ onMouseOverMetric }) => {
  const { projectId } = useParams();
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

type SnapshotsChartProps = {
  metricLabel: string;
};

export const SnapshotsChart: React.FC<SnapshotsChartProps> = ({ metricLabel }) => {
  const { projectId } = useParams();
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
