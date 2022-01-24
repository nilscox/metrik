import { useParams } from 'react-router-dom';

import { useAppSelector } from '../../../../hooks/useAppSelector';
import { selectProject } from '../../../domain/project.slice';
import { selectLastSnapshot } from '../../../domain/selectors/selectSnapshots/selectSnapshots';

export const ProjectSettings: React.FC = () => {
  const { projectId } = useParams();
  const project = useAppSelector(selectProject, projectId);
  const date = useAppSelector(selectLastSnapshot, projectId)?.date.toISOString();

  return (
    <>
      <div>Default branch: {project.defaultBranch}</div>
      <div>Snapshots: {project.snapshots.length}</div>
      <div>Last snapshot: {date}</div>
    </>
  );
};
