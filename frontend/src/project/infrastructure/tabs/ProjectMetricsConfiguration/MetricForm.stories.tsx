import React from 'react';

import { Meta, Story } from '@storybook/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { ICreateMetricDto } from '@shared/dtos/project/ICreateMetricDto';
import { IMetricDto, IProjectDto } from '@shared/dtos/project/IProjectDto';
import { ISnapshotDto } from '@shared/dtos/project/ISnapshotDto';
import { createProject, setProject } from '~/project/domain';
import { createStore, ProjectGateway } from '~/store';

import { CreateMetricForm } from './CreateMetricForm';

class StubProjectGateway implements ProjectGateway {
  fetchProject(projectId: string): Promise<IProjectDto | undefined> {
    throw new Error('Method not implemented.');
  }

  fetchSnapshots(projectId: string, branch?: string): Promise<ISnapshotDto[]> {
    throw new Error('Method not implemented.');
  }

  async createMetric(projectId: string, dto: ICreateMetricDto): Promise<IMetricDto> {
    console.log('createMetric', { projectId, dto });
    await new Promise((r) => setTimeout(r, 1000));
    return { id: 'metricId', ...dto };
  }
}

const store = createStore({ projectGateway: new StubProjectGateway() });
const project = createProject({ id: 'projectId' });

store.dispatch(setProject(project));

export default {
  title: 'MetricForm',
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={[`/${project.id}`]}>
        <Routes>
          <Route path="/:projectId" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
} as Meta;

export const createMetricForm: Story = () => <CreateMetricForm />;
