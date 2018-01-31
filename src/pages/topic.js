import React from 'react';
export default ({ match }) => (
  <div className='u-p'>
    <h3>{match.params.topicId}</h3>
  </div>
);