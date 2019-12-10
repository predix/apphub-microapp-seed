const log = require('../../common/logger')('middleware:web-sockets');

/**
 *
 * @param {Server} app - An express server instance.
 * @param {Express} server - An http server instance.
 */
module.exports = (app, server) => {
  const expressWs = require('express-ws')(app, server, {
    wsOptions: {}
  });
  log.info('web-sockets middleware', 'loaded');

  /**
   * Web Socket
   */

  const wss = expressWs.getWss();

  const router = require('express').Router();
  router.use(function(req, res, next) {
    log.info('web-socket middleware');
    log.info('web-socket clients', wss.clients);
    req.testing = 'testing';
    return next();
  });

  router.ws('/echo', function(ws, req) {
    log.info('/echo', req);

    ws.on('open', () => {
      log.info('web-socket connection opened');
    });

    ws.on('close', (code, reason) => {
      log.info('web-socket connection closed', code, reason);
    });

    ws.on('message', function(msg) {
      log.info('message', msg);
      ws.send(msg);
    });
  });

  router.ws('/', function(ws, req) {
    ws.on('open', () => {
      log.info('web-socket connection opened');
    });

    ws.on('close', (code, reason) => {
      log.info('web-socket connection closed', code, reason);
    });

    ws.on('chatMessage', function(msg) {
      log.info(msg);
      log.info('@@@@@@ Got message from client', msg);
    });

    ws.on('message', function(msg) {
      log.info('web-socket', 'message', msg);
      log.info(msg);
    });

    // A super simple demo to show server data stream to client periodically
    let notifierInterval;
    clearInterval(notifierInterval);

    ws.on('subscribeToTimer', (interval) => {
      log.info('client is subscribing to timer with interval ', interval);
      notifierInterval = setInterval(function() {
        const msg = new Date();
        ws.send({ event: 'timer', data: msg });
      }, interval);
    });
  });

  app.use('/ws', router);

  /**
   * Socket.io Demo
   */
  function attachSocketio(http) {
    const io = require('socket.io')();
    io.attach(http, {
      path: process.env.SOCKET_IO_PATH || '/socket.io',
      serveClient: true,
      pingInterval: 5000,
      pingTimeout: 15000,
      origins: '*'
    });

    io.on('connection', function(client) {
      log.info('Client connected...', client.id);

      client.on('join', function(data) {
        log.info('socket.io-join', data);
        client.emit('messages', 'Hello from server');
      });

      client.on('chatMessage', function(msg) {
        log.info('@@@@@@ Got message from client', client.id, msg);
        client.emit('chatMessage', msg);
        client.broadcast.emit('chatMessage', msg);
      });

      client.on('notifyUser', function(user) {
        client.emit('notifyUser', user);
      });

      // A super simple demo to show server data stream to client periodically
      let notifierInterval;
      clearInterval(notifierInterval);

      client.on('subscribeToTimer', (interval) => {
        log.info('client is subscribing to timer with interval ', interval);
        notifierInterval = setInterval(function() {
          const msg = new Date();
          client.emit('timer', new Date());
        }, interval);
      });

      client.on('disconnect', function() {
        log.info('@@@@@@ Client disconnected @@@@@');
        clearInterval(notifierInterval);
      });
    });
  }
};
