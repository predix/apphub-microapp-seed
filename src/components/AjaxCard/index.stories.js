import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs/react';
import AjaxCard from '.';

storiesOf('apphub-microapp-seed / Components / AjaxCard', module)
  .addDecorator(withKnobs)
  .add('default', () => (
    <AjaxCard
      headerText={text('headerText', 'Demo of Ajax Card')}
      icon={text('icon', 'px-nav:home')}
    />
  ));
