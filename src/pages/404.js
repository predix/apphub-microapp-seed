import React from 'react';
import {Flex} from 'predix-ui';

export default ({ location }) => (
  <Flex middle center>
    {location && <h3>No match for <code>{location.pathname}</code></h3>}
    {!location && <h2 className='beta'>Ooops, 404</h2>}
  </Flex>
)