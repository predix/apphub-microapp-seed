import React from 'react';
import { Button, Icon, Card } from 'predix-ui';

export default class extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div className='u-p'>
        <Card headerText='About'>
          <p>This is the about page.</p>
          <p>This is the next version of the microapp-seed it is fast.
            If compiles both server and client so the bundle that gets deployed is optimized.</p>
        </Card>
      </div>
    )
  }
}
