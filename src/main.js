import 'promise-polyfill';
import 'style';

let root;

const init = () => {
  root = document.querySelector('#root');
  let App = require('./components/app').default;
  new App(root);
};

init();

// register ServiceWorker via OfflinePlugin, for prod only:
if (process.env.NODE_ENV === 'production') {
  require('./pwa');
}

// in development, set up HMR:
if (module.hot) {
  console.warn('In development');
  module.hot.accept('./components/app', () => requestAnimationFrame(init));
}
