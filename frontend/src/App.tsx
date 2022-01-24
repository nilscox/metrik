import { Link, Route, Routes, useParams } from 'react-router-dom';

import { useAppSelector } from './hooks/useAppSelector';
import { selectProject } from './project/domain/project.slice';
import { ProjectPage } from './project/infrastructure/ProjectPage';

export const App: React.FC = () => {
  return (
    <div className="container py-4 mx-auto ">
      <Header />
      <ProjectRoutes />
    </div>
  );
};

const ProjectRoutes: React.FC = () => (
  <Routes>
    <Route index element={<Link to="/project/f3ohe3vEjixftLhrzVGgT">Project page</Link>} />
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
  const { projectId } = useParams();
  const project = useAppSelector(selectProject, projectId);

  if (!project) {
    return null;
  }

  return (
    <>
      <strong>{project.name}</strong>'s metrics
    </>
  );
};
