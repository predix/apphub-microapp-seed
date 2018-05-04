import React from 'react';
import { Accordion, Card } from 'predix-ui';

export default () => (
  <div className="about-page u-ph">
    <Card headerText="About">
      <p>This is the about page.</p>

      <Accordion headerText="Header Caption" status="Last Updated: 3 Days Ago">
        Accordion content goes here.
      </Accordion>

      <Accordion headerText="Header Caption" status="Last Updated: 3 Days Ago">
        Accordion content goes here.
      </Accordion>
    </Card>
  </div>
);
