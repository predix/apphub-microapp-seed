import React from 'react';
import Card from 'predix-ui/dist/es/components/px/Card';
import KeyValuePair from 'predix-ui/dist/es/components/px/KeyValuePair';
import Flex from 'predix-ui/dist/es/styles/flex';

const dashboardData = {
  keyVals: [
    { label: 'New Alerts', value: '21' },
    { label: 'Utilization', value: '70', uom: '%' },
    { label: 'Faults', value: '3' },
    { label: 'Output', value: '50', uom: 'mw' }
  ]
};

export default () => (
  <div className="about-page u-ph">
    <Card headerText="About">
      <p>This is the about page.</p>
    </Card>
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
  </div>
);
