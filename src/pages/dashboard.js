import React from 'react';
import Card from 'predix-ui/dist/es/components/px/Card';
import KeyValuePair from 'predix-ui/dist/es/components/px/KeyValuePair';
import Flex from 'predix-ui/dist/es/styles/flex';

import AjaxCard from '../components/AjaxCard';
import NotificationsCard from '../components/NotificationCard';
import WebSocketCard from '../components/WebSocketCard';
import EventStreamCard from '../components/EventStreamCard';

const dashboardData = {
  keyVals: [
    { id: 1, label: 'New Alerts', value: 21 },
    {
      id: 2,
      label: 'Utilization',
      value: '70',
      uom: '%'
    },
    {
      id: 3,
      label: 'Faults',
      value: 3
    },
    {
      id: 4,
      label: 'Output',
      value: 53,
      uom: 'mw'
    }
  ]
};

export default () => (
  <div className="u-ph">
    <Card headerText="Right Now" className="u-mb">
      <Flex middle spaced>
        {dashboardData.keyVals.map((item) => (
          <KeyValuePair
            key={item.id}
            className="u-p"
            label={item.label}
            uom={item.uom || null}
            value={item.value.toString()}
            size="beta"
          />
        ))}
      </Flex>
    </Card>

    <AjaxCard />

    <NotificationsCard />
    <WebSocketCard />
    <EventStreamCard />
  </div>
);
