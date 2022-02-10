import ChevronRight from '@material-design-icons/svg/round/chevron_right.svg';
import cx from 'classnames';
import { Link } from 'react-router-dom';

import { Collapse } from '~/components/Collapse/Collapse';
import { useAppSelector } from '~/hooks/useAppSelector';
import { useParam } from '~/hooks/useParam';
import { useSearchParam } from '~/hooks/useSearchParam';
import { Metric, selectProjectMetrics } from '~/project/domain';

import { CreateMetricForm } from './CreateMetricForm';
import { MetricForm } from './MetricForm';

export const ProjectMetricsConfiguration: React.FC = () => {
  const projectId = useParam('projectId');

  const metrics = useAppSelector(selectProjectMetrics, projectId);

  const openMetric = useSearchParam('metric');
  const isMetricOpen = (metric: Metric) => metric.id === openMetric;

  return (
    <>
      <CreateMetricForm />

      <ul>
        {metrics.map((metric) => (
          <li key={metric.id} className="p-2">
            <Link
              to={{ search: isMetricOpen(metric) ? '' : `?metric=${metric.id}` }}
              className="flex flex-row no-underline text-current"
            >
              <ChevronRight
                className={cx('fill-gray-600 mr-2 transition', isMetricOpen(metric) && 'rotate-90')}
              />
              {metric.label}
            </Link>
            <Collapse open={isMetricOpen(metric)}>
              <MetricForm metric={metric} submitButtonText="Save" submitting={false} onSubmit={console.log} />
            </Collapse>
          </li>
        ))}
      </ul>
    </>
  );
};
