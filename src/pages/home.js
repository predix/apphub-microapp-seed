import React from 'react';
import Notification from 'predix-ui/dist/es/components/px/Notification';
import Loadable from 'react-loadable';

import Loading from '../components/Loading';

const LoadableExample = Loadable({
  loader: () => import('../components/Example'),
  loading: Loading
});

const AjaxCardExample = Loadable({
  loader: () => import('../components/AjaxCard'),
  loading: Loading
});

export default () => (
  <div className="home-page u-ph">
    <Notification type="info" statusIcon="px-utl:flag" opened>
      Welcome back!
    </Notification>
    <br />
    <LoadableExample />
    <AjaxCardExample />
  </div>
);
