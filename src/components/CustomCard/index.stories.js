import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean } from '@storybook/addon-knobs/react';
import CustomCard from './';

storiesOf('apphub-microapp-seed / Components / CustomCard', module)
  .addDecorator(withKnobs)
  .add('default', () => (
    <CustomCard
      icon={text('icon', 'px-nav:home')}
      headerText={text('headerText', 'Demo of Custom Card')}
      closed={boolean('closed', false)}
    >
      <p>This is content</p>
    </CustomCard>
  ));
