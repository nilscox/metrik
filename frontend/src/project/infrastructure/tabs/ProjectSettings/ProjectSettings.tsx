import { useAppSelector } from '~/hooks/useAppSelector';
import { useParam } from '~/hooks/useParam';
import { selectProject } from '~/project/domain/project.selectors';

import { selectLastSnapshot } from '../../../domain/selectors/selectSnapshots/selectSnapshots';

export const ProjectSettings: React.FC = () => {
  const projectId = useParam('projectId');
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
