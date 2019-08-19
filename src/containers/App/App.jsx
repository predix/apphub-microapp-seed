import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import AppNav from 'predix-ui/dist/es/components/px/AppNav';

import Loading from '../../components/Loading';

import NoMatch from '../../pages/404';

// Pages
const About = React.lazy(() => import('../../pages/about'));
const Dashboard = React.lazy(() => import('../../pages/dashboard'));
const Home = React.lazy(() => import('../../pages/home'));
const Topics = React.lazy(() => import('../../pages/topics'));

function WaitingComponent(Component) {
  return (props) => (
    <Suspense fallback={<Loading />}>
      <Component {...props} />
    </Suspense>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
      navItems: props.navItems
    };
  }

  changeRoute = (e) => {
    if (this.props.onChange) {
      this.props.onChange(e);
    }
    const selectedItem = e.selectedItem || this.state.navItems[e.selected];
    window.location.hash = selectedItem.path;
  };

  componentDidMount = () => {
    const href = window.location.hash.replace('#', '');
    const selectedItem = this.state.navItems.filter((item) => item.href === href);
    const selected = this.state.navItems.indexOf(selectedItem && selectedItem[0]);
    this.setState({ selected });
  };

  render() {
    const { navItems } = this.state;
    return (
      <div>
        <Router>
          <Suspense fallback={<Loading />} className="full-height">
            <AppNav
              title="apphub-microapp-seed"
              items={navItems}
              selected={this.state.selected}
              onChange={this.changeRoute}
            />
            <br />
            <Switch>
              <Route exact path="/" component={WaitingComponent(Home)} />
              <Route path="/dashboard" component={WaitingComponent(Dashboard)} />
              <Route path="/about" component={WaitingComponent(About)} />
              <Route path="/topics" component={WaitingComponent(Topics)} />
              <Route component={NoMatch} />
            </Switch>
          </Suspense>
        </Router>
      </div>
    );
  }
}

App.defaultProps = {
  onChange: null,
  navItems: [
    {
      id: 'home',
      path: '/',
      label: 'Home',
      icon: 'px-fea:home'
    },
    {
      id: 'about',
      path: '/about',
      label: 'About',
      icon: 'px-fea:catalog'
    },
    {
      id: 'dashboard',
      path: '/dashboard',
      label: 'Dashboard',
      icon: 'px-fea:dashboard'
    },
    {
      id: 'topics',
      path: '/topics',
      label: 'Topics',
      icon: 'px-fea:log'
    }
  ]
};

App.propTypes = {
  onChange: PropTypes.func,
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      path: PropTypes.string,
      label: PropTypes.string,
      icon: PropTypes.string
    })
  )
};

export default App;
