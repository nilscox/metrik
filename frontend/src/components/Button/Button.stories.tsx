import React from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Button } from './Button';

export default {
  title: 'Button',
} as ComponentMeta<typeof Button>;

const template: ComponentStory<typeof Button> = (args) => <Button {...args}>Click me</Button>;

export const button = template.bind({});

export const disabled = template.bind({});
disabled.args = { disabled: true };

export const loading = template.bind({});
loading.args = { loading: true };
