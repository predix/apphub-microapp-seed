import 'promise-polyfill';
import 'isomorphic-fetch';
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

//App component
import App from './components/app';

//App styles
import './styles';

// register ServiceWorker via OfflinePlugin, for prod only:
if (process.env.NODE_ENV === 'production') {
  //require('./pwa');
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

// Webpack Hot Module Replacement API
if (module.hot) {
  console.warn('In development');
  module.hot.accept('./components/App', () => {
    render(App)
  })
}
