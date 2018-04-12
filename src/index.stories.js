import React from 'react';
import { storiesOf } from '@storybook/react';

const PageHeader = ({title}) => (
  <div className='page-header'>
    <h1>{title}</h1>
  </div>
);
/*
 storiesOf('apphub-microapp-seed', module)
    .add('Welcome to Storybook', () => (
      <div>
        <h2>Welcome</h2>
        <p>Storybook enables you to create and test your components in isolation</p>
      </div>
    ))
;

*/