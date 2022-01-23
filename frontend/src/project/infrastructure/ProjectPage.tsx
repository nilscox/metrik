import { useParams } from 'react-router-dom';

import { useAppSelector } from '../../hooks/useAppSelector';
import { useEffectDispatch } from '../../hooks/useEffectDispatch';
import { loadProject } from '../domain/loadProject';
import {
  selectLastSnapshot,
  selectLastSnapshotDate,
  selectLoadingProjects,
  selectMetricUnitDisplayValue,
  selectProject,
} from '../domain/project.slice';

export const ProjectPage: React.FC = () => {
  const { projectId } = useParams();

  const loadingProjects = useAppSelector(selectLoadingProjects);
  const project = useAppSelector(selectProject, projectId);
  const lastSnapshot = useAppSelector(selectLastSnapshot, projectId);
  const date = useAppSelector(selectLastSnapshotDate, projectId);

  useEffectDispatch(loadProject(projectId), []);

  if (loadingProjects) {
    return <>Loading projects...</>;
  }

  if (!project) {
    return <>Error</>;
  }

  return (
    <>
      <h2 className="my-2 text-xl">{project.name}'s metrics</h2>
      <div className="flex flex-row justify-evenly">
        {lastSnapshot.metrics.map((metric, n) => (
          <Metric key={n} projectId={projectId} {...metric} />
        ))}
      </div>
      <div>Snapshots: {project.snapshots.length}</div>
      <div>Last snapshot: {date}</div>
      <div>Default branch: {project.defaultBranch}</div>
      <div>
        Config:
        <ul className="list-disc pl-8">
          {project.metricsConfig.map(({ label, unit }) => (
            <li key={label}>
              {label} ({unit})
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

type MetricProps = {
  projectId: string;
  label: string;
  value: number;
};

const Metric: React.FC<MetricProps> = ({ projectId, label, value }) => {
  const unit = useAppSelector(selectMetricUnitDisplayValue, projectId, label);

  return (
    <div className="flex flex-col justify-center items-center" style={{ width: 160, height: 160 }}>
      <div className="flex items-baseline">
        <span className="text-5xl font-semibold">{value}</span>
        <span className="text-2xl ml-1">{unit}</span>
      </div>
      <div className="mt-4 text-gray-600">{label}</div>
    </div>
  );
};
