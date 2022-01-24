import { useParams } from 'react-router-dom';

import { useAppSelector } from '../../../../hooks/useAppSelector';
import { selectProject } from '../../../domain/project.slice';

export const ProjectMetricsConfiguration: React.FC = () => {
  const { projectId } = useParams();
  const project = useAppSelector(selectProject, projectId);

  return (
    <>
      <ul className="pl-8 list-disc">
        {project.metricsConfig.map(({ label, unit }) => (
          <li key={label}>
            {label} ({unit})
          </li>
        ))}
      </ul>
    </>
  );
};
