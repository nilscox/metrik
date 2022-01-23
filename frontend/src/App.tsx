import { Link, Route, Routes } from 'react-router-dom';

import { ProjectPage } from './project/infrastructure/ProjectPage';

export const App: React.FC = () => {
  return (
    <div className="container mx-auto">
      <header>
        <h1 className="my-4 text-3xl">Metrik</h1>
      </header>
      <Routes>
        <Route path="/project/:projectId" element={<ProjectPage />} />
        <Route path="/" element={<Link to="/project/f3ohe3vEjixftLhrzVGgT">Project page</Link>} />
      </Routes>
    </div>
  );
};
