import React from 'react';
import { Button, Icon, Card } from 'predix-ui';

export default class extends React.Component {
  constructor(props){
    super(props);
    this.displayName = 'AboutPage';
    this.state = {
      userInfo: null,
      userVerify: null
    };
    this.getUserInfo = this.getUserInfo.bind(this);
  }
  getUserInfo(e){
    e.preventDefault();
    fetch('/user/info').then(resp => {
      console.log('json', resp);
      return resp.json();
    }).then(json => {
      console.log(json);
    });
  }
  getVerifyUser(){

  }
  render(){
    const {userInfo, userVerify} = this.state;
    return (
      <div className='u-p'>

        <Card headerText='About'>
          <p>This is the about page.</p>
          <p>This is the next version of the microapp-seed it is fast.
            If compiles both server and client so the bundle that gets deployed is optimized.</p>
        </Card>

        <Card headerText='Authentication'>
          <p>This micro-app also has built in authentication using UAA. When running inside AppHub this is already taken care of.</p>
          <p>If you want to use your own UAA authentication, you can set the following environment variables.</p>
          <pre>{`
UAA_URL             = https://uaa-instance.predix-uaa.run.aws-usw02-pr.ice.predix.io
UAA_CALLBACK_URL    = http://localhost:9000/oauth/callback
UAA_CLIENT_ID       = test-client
UAA_CLIENT_SECRET   = test
          `}</pre>

          <a href="/login" className="btn">Login</a>
          <Button onClick={this.getUserInfo}>Get User Info</Button>
          <a href="/user/info" className="btn">User Info</a>
          <a href="/user/verify" className="btn">Verify Token</a>
          <a href="/logout" className="btn">Logout</a>
        </Card>

        {userInfo &&
          <Card headerText='User Info Response'>
          {JSON.stringify(userInfo)}
          </Card>
        }

        {userInfo &&
          <Card headerText='User Verify Response'>

          </Card>
        }
        {/*
          <Card headerText='Swagger'>
            <p>You can modify the <code>api.yaml</code> file is located in the <code>server/common/swagger</code> directory.</p>
            <p>You can also explore the API using the <a href="/api-explorer" target="_blank">API Explorer</a></p>
          </Card>
          */}

      </div>
    )
  }
}
