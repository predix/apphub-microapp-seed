import React from 'react';
import { Button, Icon, Card } from 'predix-ui';
import AjaxCard from '../components/AjaxCard';
import CustomCard from '../components/CustomCard';

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

        <AjaxCard/>

        

      </div>
    )
  }
}
