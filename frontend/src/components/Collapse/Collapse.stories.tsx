import React, { useState } from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Collapse } from './Collapse';

export default {
  title: 'Collapse',
  component: Collapse,
} as ComponentMeta<typeof Collapse>;

export const collapse: ComponentStory<typeof Collapse> = () => {
  const [open, setOpen] = useState(true);

  return (
    <>
      <button onClick={() => setOpen(!open)}>{open ? 'close' : 'open'}</button>

      <Collapse open={open}>
        {Array(8)
          .fill(null)
          .map((_, n) => (
            <div key={n}>Some content</div>
          ))}
      </Collapse>
    </>
  );
};
