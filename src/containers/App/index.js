import React from 'react';
import PropTypes from 'prop-types';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { AppNav } from 'predix-ui';

// Pages
import About from '../../pages/about';
import Dashboard from '../../pages/dashboard';
import Home from '../../pages/home';
import Topics from '../../pages/topics';
import NoMatch from '../../pages/404';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navItems: props.navItems
    };
  }

  changeRoute = (e) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(e);
    }
    const { navItems } = this.state;
    const { selectedItem } = e || navItems[e.selected];
    const { path } = selectedItem;
    window.location.hash = path;
  }

  render() {
    const { navItems } = this.state;
    return (
      <div>
        <Router>
          <div className="full-height">
            <AppNav title="apphub-microapp-seed" items={navItems} onChange={this.changeRoute} />
            <br />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/about" component={About} />
              <Route path="/topics" component={Topics} />
              <Route component={NoMatch} />
            </Switch>
          </div>
        </Router>
      </div>
    );
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
