import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer, setConfig } from 'react-hot-loader';
import App from './containers/App';

import './polyfills';
import './styles/index.scss';

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root')
  );
};

render(App);

if (process.env.NODE_ENV === 'production') {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js').then((registration) => {
        console.log('SW registered: ', registration);
      }).catch((registrationError) => {
        console.error('SW registration failed: ', registrationError);
      });
    });
  }
}

if (process.env.NODE_ENV === 'development') {
  setConfig({ logLevel: 'debug' });
  if (module.hot) {
    module.hot.accept(() => {
      render(App);
    });
  }
}
