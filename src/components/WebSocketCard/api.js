//import openSocket from 'socket.io-client';
import io from 'socket.io-client';
var socketUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;

//If in apphub / change to microapp name;
if (window.location.pathname !== '/') {
  console.log('Not running on base domain, change SocketURL');
}
if (process.env.NODE_ENV === 'production') {
  //socketUrl = `${window.location.protocol}//${window.location.host}/microapp-polymer`;
}

console.log('Socket URL', socketUrl);

/**
 *
 * Vanilla Web Sockets Demo
 *
 */

class SocketApi {
  constructor(url, opts) {
    this.socketUrl = url;
    this.socketOpts = opts;
    this.eventListeners = {};
  }

  addEventListeners() {
    if (!this.socket) {
      return;
    }
    this.socket.onopen = (event) => {
      console.log('onopen', event);
      if (this.eventListeners['open']) {
        this.eventListeners['open'].call(this, event);
      }
    };
    this.socket.onclose = (event) => {
      console.log('onclose', event);
    };
    this.socket.onerror = (event) => {
      console.log('onerror', event);
    };
    this.socket.onmessage = (event) => {
      console.log('onmessage', event);
    };
  }

  log(...args) {
    console.log('[SocketApi]', args);
  }

  on(event, handler) {
    this.log('on', event);
    this.eventListeners[event] = handler;
  }

  emit(event, data) {
    this.log('emit', event, data);
    this.sendMessage(event, data);
  }

  connect(cb) {
    this.log('connect');
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.log('connect', 'socket is already open.');
      return this;
    }
    try {
      this.socket = new WebSocket(this.socketUrl, this.socketOpts);
      this.socket.addEventListener('open', cb);
      this.addEventListeners();
    } catch (err) {
      console.error('SocketApi', 'error creating connection', err);
    }
  }

  disconnect() {
    this.log('disconnect');
    return this.socket.close();
  }

  sendMessage(event, msg) {
    let data = {
      event: event,
      data: msg
    };
    if (this.socket.readyState === WebSocket.OPEN) {
      this.log('sendMessage', msg);
      return this.socket.send(data);
    } else if (this.socket.readyState === WebSocket.CONNECTING) {
      this.log('sendMessage', 'socket is still connecting...');
      return false;
    } else {
      this.log('sendMessage', 'socket is closed.');
      return;
    }
  }

  subscribeToTimer(cb) {
    this.on('timer', (timestamp) => cb(null, timestamp));
    this.emit('subscribeToTimer', 1000);
  }

  subscribeToMessages(cb) {
    this.on('chatMessage', (msg) => cb(null, msg));
  }
}

/**
 *
 * Socket.io Client Demo
 */

const socket = io(socketUrl, {
  autoConnect: false,
  //TODO - Get from env var
  path: '/microapp-socket'
});

socket.on('connect', () => {
  console.log('Socket connected', socket.id);
});
socket.on('ping', () => {
  console.log(`Socket ${socket.id} ping`);
});
socket.on('pong', (ms) => {
  console.log(`Socket ${socket.id} pong`, ms);
});
socket.on('disconnect', (reason) => {
  console.log(`Socket ${socket.id} disconnected`, reason);
});
socket.on('connect_error', (err) => {
  console.log('Socket connect error', err);
});

function subscribeToTimer(cb) {
  socket.on('timer', (timestamp) => cb(null, timestamp));
  socket.emit('subscribeToTimer', 1000);
}

function subscribeToMessages(cb) {
  socket.on('chatMessage', (msg) => cb(null, msg));
}

function sendMessage(msg) {
  console.log('sendMessage', msg);
  socket.emit('chatMessage', msg);
}

function connect() {
  console.log('connect');
  return socket.connect();
}

function disconnect() {
  console.log('disconnect');
  socket.removeAllListeners('chatMessage');
  socket.removeAllListeners('timer');
  socket.removeAllListeners('subscribeToTimer');

  return socket.close();
}

export default SocketApi;
