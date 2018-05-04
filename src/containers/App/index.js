import React from 'react';
import PropTypes from 'prop-types';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { AppNav } from 'predix-ui';

// Pages
import About from '../../pages/about';
import Home from '../../pages/home';
import Dashboard from '../../pages/dashboard';
import Topics from '../../pages/topics';
import NoMatch from '../../pages/404';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      style: {
        transition: 'all .5s',
        opacity: 1,
        selectedItem: null
      },
      navItems: props.navItems
    };
    this.changeRoute = this.changeRoute.bind(this);
  }

  componentDidMount() {
    window.location.hash = '/';
    setTimeout(() => {
      this.setState({
        style: {
          display: 'block',
          opacity: 1
        }
      });
    }, 500);
  }

  changeRoute(e) {
    if (this.props.onChange) {
      this.props.onChange(e);
    }
    const selectedItem = e.selectedItem || this.state.navItems[e.selected];
    window.location.hash = selectedItem.path;
  }

  render() {
    const { style } = this.state;
    return (
      <Router>
        <div style={style} className="full-height">
          <AppNav title="apphub-microapp-seed" items={this.state.navItems} onChange={this.changeRoute} />
          <br />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/about" component={About} />
            <Route path="/topics" component={Topics} />
            <Route component={NoMatch} />
          </Switch>
        </div>
      </Router>);
  }
}

App.defaultProps = {
  onChange: null,
  navItems: [{
    id: 'home', path: '/', label: 'Home', icon: 'px-fea:home'
  },
  {
    id: 'about', path: '/about', label: 'About', icon: 'px-fea:catalog'
  },
  {
    id: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: 'px-fea:dashboard'
  },
  {
    id: 'topics', path: '/topics', label: 'Topics', icon: 'px-fea:log'
  }]
};

App.propTypes = {
  onChange: PropTypes.func,
  navItems: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    path: PropTypes.string,
    label: PropTypes.string,
    icon: PropTypes.string
  }))
};

export default App;
