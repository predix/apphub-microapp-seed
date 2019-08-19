import React from 'react';
import { Card, Notification, Flex } from 'predix-ui';
import Loadable from 'react-loadable';
import Loading from '../components/Loading';

const LoadableExample = Loadable({
  loader: () => import('../components/Example'),
  loading: Loading
});

const features = [
  { title: 'Predix UI (react)', href: 'https://jonniespratley.github.io/predix-ui/#/' },
  { title: 'Webpack 4.x', href: 'https://webpack.js.org/' },
  { title: 'Babel', href: 'https://babeljs.io/' },
  { title: 'React', href: 'https://reactjs.org/' },
  { title: 'React Router', href: 'https://reacttraining.com/react-router/web/guides/philosophy' },
  { title: 'Storybook.js', href: 'https://storybook.js.org/' },
  { title: 'Express', href: 'https://expressjs.com/' },
  { title: 'Nightwatch.js', href: 'http://nightwatchjs.org/' },
  { title: 'Jest', href: 'https://facebook.github.io/jest/' }
];

export default () => (
  <div className="home-page u-ph">
    <Notification type="info" statusIcon="px-utl:flag" opened>
      Welcome back!
    </Notification>
    <br />
    <Card headerText="Features">
      <p>This simple micro-app seed contains just enough to get you started.</p>
      <p>
Some
        <code>development</code>
        {' '}
features include:
      </p>
      <ul>
        {features.map(feature => (
          <li key={feature.title}>
            <a href={feature.href} title={feature.title} target="noopener noreferrer">
              {feature.title}
            </a>
          </li>
        ))}
      </ul>
    </Card>

    <LoadableExample />

  </div>
);
