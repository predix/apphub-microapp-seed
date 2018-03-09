import 'promise-polyfill';
import 'isomorphic-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer, setConfig } from 'react-hot-loader';

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
    module.hot.accept('./containers/App', () => {
      render(App);
    });
    
  }
}
