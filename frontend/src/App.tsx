import { useAppSelector } from './hooks/useAppSelector';
import { useEffectDispatch } from './hooks/useEffectDispatch';
import { loadProjects } from './project/domain/loadProject';
import { selectLoadingProjects, selectProject } from './project/domain/project.slice';

export const App: React.FC = () => {
  const loadingProjects = useAppSelector(selectLoadingProjects);
  const project = useAppSelector(selectProject, '1');

  useEffectDispatch(loadProjects(), []);

  if (loadingProjects || !project) {
    return <>Loading projects...</>;
  }

  const lastSnapshot = project.snapshots[project.snapshots.length - 1];

  return (
    <>
      {lastSnapshot.date}
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
        {lastSnapshot.metrics.map((metric, n) => (
          <Metric
            key={n}
            {...metric}
            unit={project.metricsConfig.find((config) => config.label === metric.label).unit}
          />
        ))}
      </div>
    </>
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
