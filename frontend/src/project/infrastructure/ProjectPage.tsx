import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

import { Tab, TabPanel, Tabs } from '~/components/Tabs/Tabs';
import { useAppSelector } from '~/hooks/useAppSelector';
import { useEffectDispatch } from '~/hooks/useEffectDispatch';
import { useParam } from '~/hooks/useParam';

import { selectLoadingProjects, selectProjectUnsafe } from '../domain/project.selectors';
import { loadProject } from '../domain/usecases/loadProject/loadProject';

import { ProjectDashboard } from './tabs/ProjectDashboard/ProjectDashboard';
import { ProjectMetricsConfiguration } from './tabs/ProjectMetricsConfiguration/ProjectMetricsConfiguration';
import { ProjectSettings } from './tabs/ProjectSettings/ProjectSettings';

export const ProjectPage: React.FC = () => (
  <Routes>
    <Route index element={<Navigate to="/project/f3ohe3vEjixftLhrzVGgT" />} />
    <Route path=":projectId" element={<ProjectPageLayout />}>
      <Route index element={<ProjectTab tab={ProjectDashboard} />} />
      <Route path="metrics" element={<ProjectTab tab={ProjectMetricsConfiguration} />} />
      <Route path="settings" element={<ProjectTab tab={ProjectSettings} />} />
    </Route>
  </Routes>
);

const ProjectTab: React.FC<{ tab: React.ComponentType }> = ({ tab: Tab }) => (
  <TabPanel className="pt-4">
    <Tab />
  </TabPanel>
);

const ProjectPageLayout: React.FC = () => {
  const projectId = useParam('projectId');

  const loadingProjects = useAppSelector(selectLoadingProjects);
  const project = useAppSelector(selectProjectUnsafe, projectId);

  useEffectDispatch(loadProject(projectId), []);

  if (loadingProjects) {
    return <>Loading projects...</>;
  }

  if (!project) {
    return <>Error</>;
  }

  return (
    <>
      <Tabs>
        <Tab>Dashboard</Tab>
        <Tab link="metrics">Metrics configuration</Tab>
        <Tab link="settings">Project settings</Tab>
      </Tabs>

      <Outlet />
    </>
  );
};
