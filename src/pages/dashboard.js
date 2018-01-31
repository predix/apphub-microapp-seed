import React from 'react';
import {AppHeader, Card} from 'predix-ui';

//TODO - Fetch from backend
const dashboardData = {
  keyVals: [
    {label: 'New Alerts', value: 21},
    {label: 'Utilization', value: '70', uom: '%'},
    {label: 'Faults', value: 3},
    {label: 'Output', value: 53, uom: 'mw'}
  ],
  cards: [
    { id: 1, title: 'Card 1', children: <div>Lorem ipsum dolor sit</div> }
  ]
};

export default () => (
  <div className='u-p'>
    {dashboardData.cards && dashboardData.cards.map((card, index) => (
      <Card key={index} headerText={card.title}>
        {card.children}
      </Card>
    ))}
  </div>
);
