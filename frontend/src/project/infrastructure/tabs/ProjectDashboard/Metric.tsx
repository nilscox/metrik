import { useAppSelector } from '~/hooks/useAppSelector';
import { selectMetricLabel, selectMetricUnitDisplayValue } from '~/project/domain';

type MetricProps = {
  projectId: string;
  metricId: string;
  value: number;
  onMouseOver: () => void;
};

export const Metric: React.FC<MetricProps> = ({ projectId, metricId, value, onMouseOver }) => {
  const label = useAppSelector(selectMetricLabel, projectId, metricId);
  const unit = useAppSelector(selectMetricUnitDisplayValue, projectId, metricId);

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
