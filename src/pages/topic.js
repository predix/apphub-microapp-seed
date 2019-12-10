import React from 'react';

/* eslint-disable-next-line */
export default ({ match = {} }) => (
  <div className="u-p">
    <h3>
      {'topicId = '}
      {match.params.topicId}
    </h3>
    <pre>
      {'match:'}
      {JSON.stringify(match, null, 2)}
    </pre>
  </div>
);
