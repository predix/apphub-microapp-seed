import React from 'react';
import Card from 'predix-ui/dist/es/components/px/Card';

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
  <div className="about-page u-ph">
    <Card headerText="About">
      <p>This simple micro-app seed contains just enough to get you started.</p>
      <p>Some features include:</p>
      <ul>
        {features.map((feature) => (
          <li key={feature.title}>
            <a href={feature.href} title={feature.title} target="noopener noreferrer">
              {feature.title}
            </a>
          </li>
        ))}
      </ul>
    </Card>
  </div>
);
