import React, { useState } from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Tab, TabPanel, Tabs } from './Tabs';

export default {
  title: 'Tabs',
  component: Tabs,
} as ComponentMeta<typeof Tabs>;

export const tabs: ComponentStory<typeof Tabs> = (args) => {
  const [active, setActive] = useState(1);

  return (
    <>
      <Tabs {...args}>
        <Tab active={active === 1} onClick={() => setActive(1)}>
          Paris
        </Tab>
        <Tab active={active === 2} onClick={() => setActive(2)}>
          Tokyo
        </Tab>
        <Tab active={active === 3} onClick={() => setActive(3)}>
          New York
        </Tab>
      </Tabs>

      {active === 1 && <TabPanel className="p-2">Paris is the capital of France.</TabPanel>}
      {active === 2 && <TabPanel className="p-2">Tokyo is the capital of Japan.</TabPanel>}
      {active === 3 && <TabPanel className="p-2">New York is not a capital.</TabPanel>}
    </>
  );
};
