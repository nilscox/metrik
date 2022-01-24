import { useParams } from 'react-router-dom';

import { useAppSelector } from '../../../hooks/useAppSelector';
import { selectLastSnapshotDate, selectProject } from '../../domain/project.slice';

export const ProjectSettings: React.FC = () => {
  const { projectId } = useParams();
  const project = useAppSelector(selectProject, projectId);
  const date = useAppSelector(selectLastSnapshotDate, projectId);

  return (
    <>
      <div>Snapshots: {project.snapshots.length}</div>
      <div>Last snapshot: {date}</div>
      <div>Default branch: {project.defaultBranch}</div>
    </>
  );
};
