import './polyfills';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer, setConfig } from 'react-hot-loader';

//App Styles
import './styles';
//import 'predix-ui/dist/predix-ui.min.css';
//import 'predix-ui/dist/css/components/px/Theme/px-theme.css';

//App component
import App from './containers/App';

// Register ServiceWorker via OfflinePlugin, for prod only:
if (process.env.NODE_ENV === 'production') {
  require('./pwa');
}

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root')
  )
}

render(App);

if (process.env.NODE_ENV === 'development') {
  setConfig({ logLevel: 'debug' });
  
  // Webpack Hot Module Replacement API
  if (module.hot) {
    console.warn('In development');
    module.hot.accept('./containers/App/index.js', () => {
      render(App);
    });
  }
}
