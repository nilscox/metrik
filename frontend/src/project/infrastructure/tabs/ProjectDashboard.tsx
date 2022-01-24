import { useParams } from 'react-router-dom';

import { useAppSelector } from '../../../hooks/useAppSelector';
import { selectLastSnapshot, selectMetricUnitDisplayValue } from '../../domain/project.slice';

export const ProjectDashboard: React.FC = () => {
  const { projectId } = useParams();
  const lastSnapshot = useAppSelector(selectLastSnapshot, projectId);

  return (
    <>
      <div className="flex flex-row justify-evenly">
        {lastSnapshot.metrics.map((metric, n) => (
          <Metric key={n} projectId={projectId} {...metric} />
        ))}
      </div>
    </>
  );
};

type MetricProps = {
  projectId: string;
  label: string;
  value: number;
};

const Metric: React.FC<MetricProps> = ({ projectId, label, value }) => {
  const unit = useAppSelector(selectMetricUnitDisplayValue, projectId, label);

  return (
    <div className="flex flex-col items-center justify-center" style={{ width: 160, height: 160 }}>
      <div className="flex items-baseline">
        <span className="text-5xl font-semibold">{value}</span>
        <span className="ml-1 text-2xl">{unit}</span>
      </div>
      <div className="mt-4 text-gray-600">{label}</div>
    </div>
  );
};
