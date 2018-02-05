import React from 'react';
import { Card } from 'predix-ui';

export default () => (
  <div className='u-p'>
    <Card headerText='Home'>
      <p>This is the home page.</p>
      <p>This is a predix-ui (react) card.</p>
    </Card>
    <Card headerText='About'>
      <p>This simple micro-app seed contains just enough to get you started.</p>
      <p>Some features include:</p>
      <ul>
        <li>React</li>
        <li>Webpack</li>
        <li>Swagger</li>
        <li>Express</li>
        <li>Babel</li>
        <li>Nightwatch.js</li>
      </ul>
    </Card>
  </div>
);
