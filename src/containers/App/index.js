import React from 'react'
import { HashRouter as Router, Route, Link, Switch } from 'react-router-dom';

import '../../styles';
//import createBrowserHistory from 'history/createBrowserHistory';
//const history = createBrowserHistory();

//Components
import { AppNav } from 'predix-ui';

//Pages
import About from '../../pages/about';
import Home from '../../pages/home';
import Dashboard from '../../pages/dashboard';
import Topics from '../../pages/topics';
import NoMatch from '../../pages/404';


const defaultNavItems = [
  {id : "home", path: '/', label: "Home", icon: "px-fea:home"},
  {id : "about", path: '/about', label: "About", icon: "px-fea:catalog"},
  {id : "dashboard", path: '/dashboard', label: "Dashboard", icon: "px-fea:dashboard"},
  {id : "topics", path: '/topics', label: "Topics", icon: "px-fea:log"}
];


class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      style: {
        //display: 'none',
        transition: 'all .5s',
        opacity: 0
      },
      navItems: props.navItems || defaultNavItems
    };
  }
  componentDidMount(){
    window.location.hash = '/';
    console.log('Component did mount');
    setTimeout(()=> {
      this.setState({style: {
        display: 'block',
        opacity: 1
      }})
    }, 500);
  }
  changeRoute(e){
    window.location.hash = e.selectedItem.path;
  }
  render() {
    const {style} = this.state;
    return (
      <Router>
      <div style={style} className='full-height'>
        <AppNav title="apphub-microapp-seed" items={this.state.navItems}  onChange={(e) => this.changeRoute(e)}/>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/dashboard" component={Dashboard}/>
            <Route path="/about" component={About}/>
            <Route path="/topics" component={Topics}/>
            <Route component={NoMatch}/>
          </Switch>
      </div>
    </Router>)
  }
}

export default App;