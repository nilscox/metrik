import ChevronRight from '@material-design-icons/svg/round/chevron_right.svg';
import cx from 'classnames';
import { Link } from 'react-router-dom';

import { MetricTypeEnum } from '@shared/enums/MetricTypeEnum';
import { Collapse } from '~/components/Collapse/Collapse';
import { useAppSelector } from '~/hooks/useAppSelector';
import { useParam } from '~/hooks/useParam';
import { useSearchParam } from '~/hooks/useSearchParam';
import { Metric, selectProjectMetrics } from '~/project/domain';

export const ProjectMetricsConfiguration: React.FC = () => {
  const projectId = useParam('projectId');

  const metrics = useAppSelector(selectProjectMetrics, projectId);

  const openMetric = useSearchParam('metric');
  const isOpen = (metric: Metric) => metric.id === openMetric;

  return (
    <ul>
      {metrics.map((metric) => (
        <li key={metric.id} className="p-2">
          <Link
            to={{ search: isOpen(metric) ? '' : `?metric=${metric.id}` }}
            className="flex flex-row no-underline text-current"
          >
            <ChevronRight className={cx('fill-gray-600 mr-2 transition', isOpen(metric) && 'rotate-90')} />
            {metric.label}
          </Link>
          <Collapse open={isOpen(metric)}>
            <MetricConfiguration metric={metric} />
          </Collapse>
        </li>
      ))}
    </ul>
  );
};

const MetricConfiguration: React.FC<{ metric: Metric }> = ({ metric }) => {
  return (
    <div className="max-w-xl py-4 pl-8 grid grid-cols-2 gap-4">
      <div>Metric ID</div>
      <div>
        <input disabled type="text" value={metric.id} />
      </div>

      <div>Metric label</div>
      <div>
        <input type="text" value={metric.label} />
      </div>

      <div>Type</div>
      <MetricTypeSelect value={metric.type} onChange={console.log} />
    </div>
  );
};

type MetricTypeSelectProps = {
  value?: MetricTypeEnum;
  onChange: (type: MetricTypeEnum) => void;
};

const MetricTypeSelect: React.FC<MetricTypeSelectProps> = ({ value }) => (
  <select value={value}>
    {Object.values(MetricTypeEnum).map((type) => (
      <option key={type} value={type}>
        {type}
      </option>
    ))}
  </select>
);
