import React from 'react';
import { Icon, Card } from 'predix-ui';

export default class extends React.Component {
  render(){
    return (
      <div className='u-p'>

        <Card headerText='About'>
          <p>This simple micro-app seed contains just enough to get you started.</p>
          <p>Some features include:</p>
          <ul>
            <li>React</li>
            <li>Webpack</li>
            <li>Swagger</li>
            <li>Express</li>
            <li>Babel</li>
            <li>Nightwatch.js</li>
          </ul>
        </Card>

        <Card headerText='Swagger'>
          <p>You can modify the <code>api.yaml</code> file is located in the <code>server/common/swagger</code> directory.</p>
          <p>You can also explore the API using the <a href="/api-explorer" target="_blank">API Explorer</a></p>
        </Card>


        <Card headerText='Authentication'>
          <p>This micro-app also has built in authentication using UAA. When running inside AppHub this is already taken care of.</p>
          <p>If you want to use your own UAA authentication, you can set the following environment variables.</p>
          <pre>
    UAA_URL             = https://uaa-instance.predix-uaa.run.aws-usw02-pr.ice.predix.io
    UAA_CALLBACK_URL    = http://localhost:9000/oauth/callback
    UAA_CLIENT_ID       = test-client
    UAA_CLIENT_SECRET   = test
          </pre>

          <a href="/login" className="btn">Login</a>
          <a href="/user/info" className="btn">User Info</a>
          <a href="/user/verify" className="btn">Verify Token</a>
          <a href="/logout" className="btn">Logout</a>
        </Card>
      </div>
    )
  }
}
