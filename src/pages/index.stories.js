import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs/react';

import ErrorPage from './404';
import Home from './home';
import About from './about';
import Dashboard from './dashboard';

storiesOf('apphub-microapp-seed / Pages', module)
  .add('Home page', () => (
    <Home />
  ))
  .add('About page', () => (
    <About />
  ))
  .add('Dashboard page', () => (
    <Dashboard />
  ))
  .add('404 page', () => (
    <ErrorPage />
  ));

