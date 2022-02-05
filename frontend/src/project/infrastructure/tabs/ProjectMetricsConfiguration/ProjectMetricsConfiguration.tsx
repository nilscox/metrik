import ChevronRight from '@material-design-icons/svg/round/chevron_right.svg';
import cx from 'classnames';
import { Link } from 'react-router-dom';

import { Collapse } from '~/components/Collapse/Collapse';
import { useAppSelector } from '~/hooks/useAppSelector';
import { useParam } from '~/hooks/useParam';
import { useSearchParam } from '~/hooks/useSearchParam';
import { selectProjectMetrics } from '~/project/domain';

export const ProjectMetricsConfiguration: React.FC = () => {
  const projectId = useParam('projectId');
  const metrics = useAppSelector(selectProjectMetrics, projectId);

  const openMetric = useSearchParam('metric');

  return (
    <ul>
      {metrics.map(({ label, type }) => (
        <li key={label} className="p-2">
          <Link to={{ search: label === openMetric ? '' : `?metric=${label}` }} className="flex flex-row">
            <ChevronRight
              className={cx('fill-gray-600 mr-2 transition', label === openMetric && 'rotate-90')}
            />
            {label}
          </Link>
          <Collapse open={label === openMetric}>{type}</Collapse>
        </li>
      ))}
    </ul>
  );
};
