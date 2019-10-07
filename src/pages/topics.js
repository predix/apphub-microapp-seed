import React from 'react';
import { Route, Link } from 'react-router-dom';
import Topic from './topic';

/* eslint-disable-next-line */
export default ({ match = { url } }) => (
  <div className="topics-page u-ph">
    <h2>Topics</h2>
    <p>The following is an example of sub-routes for a component.</p>

    <ul>
      <li>
        <Link to={`${match.url}/rendering`} href="/#">
          Rendering with React
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/components`} href="/#">
          Components
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`} href="/#">
          Props v. State
        </Link>
      </li>
    </ul>

    <Route path={`${match.url}/:topicId`} component={Topic} />
    <Route exact path={match.url} render={() => <h3>Please select a topic.</h3>} />
  </div>
);
