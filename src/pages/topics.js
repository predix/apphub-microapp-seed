import React from 'react';
import { Route, Link } from 'react-router-dom';
import Topic from './topic';

export default ({ match }) => (
  <div className='u-p'>
    <h2>Topics</h2>
		<p>The following is an example of sub-routes for a component.</p>
    <ul>
      <li>
        <Link to={`${match.url}/rendering`}>
          Rendering with React
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/components`}>
          Components
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`}>
          Props v. State
        </Link>
      </li>
    </ul>

    <Route path={`${match.url}/:topicId`} component={Topic}/>
    <Route exact path={match.url} render={() => (
      <h3>Please select a topic.</h3>
    )}/>
  </div>
);