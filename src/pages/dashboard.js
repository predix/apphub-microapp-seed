import React from 'react';
import {Flex, KeyValuePair, Card} from 'predix-ui';
import AjaxCard from '../components/AjaxCard';

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
    <Card headerText='Right Now' className='u-mb'>
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

    <AjaxCard/>

        
    {dashboardData.cards && dashboardData.cards.map((card, index) => (
      <Card key={card.id} headerText={card.title} className='u-mb'>
        {card.children && card.children.map((child, index) => <div key={index}>{child}</div>)}
      </Card>
    ))}
  </div>
);
