import React from 'react';
import { Flex, KeyValuePair, Card } from 'predix-ui';
import AjaxCard from '../components/AjaxCard';

const dashboardData = {
  keyVals: [
    { label: 'New Alerts', value: 21 },
    { label: 'Utilization', value: '70', uom: '%' },
    { label: 'Faults', value: 3 },
    { label: 'Output', value: 53, uom: 'mw' }
  ]
};

export default () => (
  <div className="u-ph">
    <Card headerText="Right Now" className="u-mb">
      <Flex middle spaced>
        {dashboardData.keyVals.map(item => (
          <KeyValuePair
            key={item.label}
            className="u-p"
            label={item.label}
            uom={item.uom}
            value={item.value}
            size="beta"
          />
          ))}
      </Flex>
    </Card>
    <AjaxCard />
  </div>
);
