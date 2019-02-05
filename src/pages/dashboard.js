import React from 'react';
import { Flex, KeyValuePair, Card } from 'predix-ui';
import AjaxCard from '../components/AjaxCard';

const dashboardData = {
  keyVals: [
    { id: 1, label: 'New Alerts', value: 21 },
    { id: 2, label: 'Utilization', value: '70', uom: '%' },
    { id: 3, label: 'Faults', value: 3 },
    { id: 4, label: 'Output', value: 53, uom: 'mw' }
  ]
};

export default () => (
  <div className="u-ph">
    <Card headerText="Right Now" className="u-mb">
      <Flex middle spaced>
        {dashboardData.keyVals.map(item => (
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
  </div>
);
