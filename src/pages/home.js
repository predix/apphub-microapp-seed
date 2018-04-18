import React from 'react';
import { Card, Notification } from 'predix-ui';

const features = [
  {title: 'Predix UI (react)', href: 'https://jonniespratley.github.io/predix-ui/#/'},
  {title: 'Webpack 3.x', href: 'https://webpack.js.org/'},
  {title: 'Babel', href: 'https://babeljs.io/'},
  {title: 'React', href: 'https://reactjs.org/'},
  {title: 'React Router', href: 'https://reacttraining.com/react-router/web/guides/philosophy'},
  {title: 'Storybook.js', href: 'https://storybook.js.org/'},
  {title: 'Express', href: 'https://expressjs.com/'},
  {title: 'Nightwatch.js', href: 'http://nightwatchjs.org/'},
  {title: 'Jest', href: 'https://facebook.github.io/jest/'}
];


export default () => (
  <div className='u-p'>
    <Notification type='info'  statusIcon='px-utl:flag' opened>Welcome back!</Notification>
    <br/>
   
    <Card headerText='Features'>
      <p>This simple micro-app seed contains just enough to get you started.</p>
      <p>Some <code>development</code> features include:</p>
      <ul>
        {features.map((f, i) => (
          <li key={i}>
            <a href={f.href} title={f.title} target='_blank'>
              {f.title}
            </a>
          </li>
        ))}
      </ul>
    </Card>
  </div>
);
