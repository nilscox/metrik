import React from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { Tab, TabPanel, Tabs } from './Tabs';

export default {
  title: 'Tabs',
  component: Tabs,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof Tabs>;

export const tabs: ComponentStory<typeof Tabs> = (args) => (
  <>
    <Tabs {...args}>
      <Tab>Paris</Tab>
      <Tab link="tokyo">Tokyo</Tab>
      <Tab link="new-york">New York</Tab>
    </Tabs>

    <Routes>
      <Route index element={<TabPanel className="p-2">Paris is the capital of France.</TabPanel>} />
      <Route path="tokyo" element={<TabPanel className="p-2">Tokyo is the capital of Japan.</TabPanel>} />
      <Route path="new-york" element={<TabPanel className="p-2">New York is not a capital.</TabPanel>} />
    </Routes>
  </>
);
