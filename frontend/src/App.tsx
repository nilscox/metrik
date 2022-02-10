import { Link, Route, Routes } from 'react-router-dom';

import { useAppSelector } from './hooks/useAppSelector';
import { useParam } from './hooks/useParam';
import { selectProjectUnsafe } from './project/domain/project.selectors';
import { ProjectPage } from './project/infrastructure/ProjectPage';

export const App: React.FC = () => {
  return (
    <div className="container py-4 mx-auto">
      <Header />
      <ProjectRoutes />
    </div>
  );
};

const ProjectRoutes: React.FC = () => (
  <Routes>
    <Route index element={<IndexPage />} />
    <Route path="project/*" element={<ProjectPage />} />
  </Routes>
);

const Header: React.FC = () => (
  <header className="flex flex-row items-center justify-between mb-4">
    <h1 className="text-3xl">
      <Link to="/" className="no-underline text-inherit">
        Metrik
      </Link>
    </h1>

    <h2>
      <Routes>
        <Route index element={<></>} />
        <Route path="project/:projectId/*" element={<ProjectName />} />
      </Routes>
    </h2>
  </header>
);

const ProjectName: React.FC = () => {
  const projectId = useParam('projectId');
  const project = useAppSelector(selectProjectUnsafe, projectId);

  if (!project) {
    return null;
  }

  return (
    <>
      <strong>{project.name}</strong>'s metrics
    </>
  );
};

const IndexPage: React.FC = () => {
  return <Link to={`/project/${process.env.PROJECT_ID}`}>Project page</Link>;
};
