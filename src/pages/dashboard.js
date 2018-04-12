import React from 'react';
import {Flex, KeyValuePair, Card} from 'predix-ui';

//TODO - Fetch from backend
const dashboardData = {
  keyVals: [
    {label: 'New Alerts', value: 21},
    {label: 'Utilization', value: '70', uom: '%'},
    {label: 'Faults', value: 3},
    {label: 'Output', value: 53, uom: 'mw'}
  ],
  cards: [
    { id: 1, title: 'Card 1'},
    { id: 2, title: 'Card 2'},
    { id: 3, title: 'Card 3' }
  ]
};

export default () => (
  <div className='u-p'>
    <Card headerText='Right Now'>
      <Flex middle spaced>
        {dashboardData.keyVals.map((item, index) => (
            <KeyValuePair
              key={index}
              className='u-p'
              label={item.label}
              uom={item.uom}
              value={item.value}
              size='beta'
            />
          ))}
      </Flex>
    </Card>
    {dashboardData.cards && dashboardData.cards.map((card, index) => (
      <Card key={card.id} headerText={card.title}>
        {card.children && card.children.map((child, index) => <div key={index}>{child}</div>)}
      </Card>
    ))}
  </div>
);
