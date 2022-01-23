import { Route, Routes, useParams } from 'react-router-dom';

import { useAppSelector } from './hooks/useAppSelector';
import { useEffectDispatch } from './hooks/useEffectDispatch';
import { loadProject } from './project/domain/loadProject';
import { selectLoadingProjects, selectProject } from './project/domain/project.slice';

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/project/:projectId" element={<ProjectPage />} />
    </Routes>
  );
};

export const ProjectPage: React.FC = () => {
  const { projectId } = useParams();

  const loadingProjects = useAppSelector(selectLoadingProjects);
  const project = useAppSelector(selectProject, projectId);

  useEffectDispatch(loadProject(projectId), []);

  if (loadingProjects) {
    return <>Loading projects...</>;
  }

  if (!project) {
    return <>Error</>;
  }

  const lastSnapshot = project.snapshots[project.snapshots.length - 1];
  const date = new Date(lastSnapshot.date);

  return (
    <div style={{ maxWidth: '80%', margin: '60px auto' }}>
      <div>
        Date: {date.getFullYear()}-{String(date.getMonth() + 1).padStart(2, '0')}-
        {String(date.getDate()).padStart(2, '0')}
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
        {lastSnapshot.metrics.map((metric, n) => (
          <Metric
            key={n}
            {...metric}
            unit={project.metricsConfig.find((config) => config.label === metric.label).unit}
          />
        ))}
      </div>
    </div>
  );
};

type MetricProps = {
  label: string;
  unit: string;
  value: number;
};

const Metric: React.FC<MetricProps> = ({ label, unit, value }) => (
  <div
    style={{
      width: 240,
      height: 240,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
      <span style={{ fontSize: '2.5em' }}>{unit === 'percent' ? value * 100 : value}</span>{' '}
      <span style={{ fontSize: '1.5em', marginLeft: 8 }}>
        {unit !== 'number' && (unit === 'percent' ? '%' : unit)}
      </span>
    </div>
    <div style={{ marginTop: 16, color: '#666' }}>{label}</div>
  </div>
);
