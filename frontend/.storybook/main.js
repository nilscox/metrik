const { ProvidePlugin } = require('webpack');

const webpackConfig = require('../webpack.config');

module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  framework: '@storybook/react',
  core: {
    builder: 'webpack5',
  },
  webpackFinal: (config) => {
    config.module.rules = webpackConfig.module.rules;
    config.plugins.push(new ProvidePlugin({ React: 'react' }));
    return config;
  },
};
