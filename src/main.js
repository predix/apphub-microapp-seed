import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer, setConfig } from 'react-hot-loader';

import './polyfills';
import './styles/index.scss';

import App from './containers/App';

if (process.env.NODE_ENV === 'production') {
  require('./pwa');
}

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root')
  );
};

render(App);

if (process.env.NODE_ENV === 'development') {
  setConfig({ logLevel: 'debug' });
  if (module.hot) {
    module.hot.accept('./containers/App/index.js', () => {
      render(App);
    });
  }
}
