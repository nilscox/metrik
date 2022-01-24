import { useAppSelector } from '../../../../hooks/useAppSelector';
import { selectMetricUnitDisplayValue } from '../../../domain/project.slice';

type MetricProps = {
  projectId: string;
  label: string;
  value: number;
  onMouseOver: () => void;
};

export const Metric: React.FC<MetricProps> = ({ projectId, label, value, onMouseOver }) => {
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
