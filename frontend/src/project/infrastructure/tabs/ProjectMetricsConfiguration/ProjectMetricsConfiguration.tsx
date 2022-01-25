import ChevronRight from '@material-design-icons/svg/round/chevron_right.svg';
import cx from 'classnames';
import { Link } from 'react-router-dom';

import { Collapse } from '~/components/Collapse/Collapse';
import { useAppSelector } from '~/hooks/useAppSelector';
import { useParam } from '~/hooks/useParam';
import { useSearchParam } from '~/hooks/useSearchParam';
import { selectProject } from '~/project/domain/project.selectors';

export const ProjectMetricsConfiguration: React.FC = () => {
  const projectId = useParam('projectId');
  const project = useAppSelector(selectProject, projectId);

  const openMetric = useSearchParam('metric');

  return (
    <ul>
      {project.metricsConfig.map(({ label, unit }) => (
        <li key={label} className="p-2">
          <Link to={{ search: label === openMetric ? '' : `?metric=${label}` }} className="flex flex-row">
            <ChevronRight
              className={cx('fill-gray-600 mr-2 transition', label === openMetric && 'rotate-90')}
            />
            {label}
          </Link>
          <Collapse open={label === openMetric}>{unit}</Collapse>
        </li>
      ))}
    </ul>
  );
};
