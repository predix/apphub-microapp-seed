const log = require('../../common/logger')('middleware:event-stream');
/**
 *
 * @param {Server} app - An express server instance.
 * @param {Express} server - An http server instance.
 */
module.exports = (app, server) => {
  log.info('middleware', 'loaded');

  function startSees(res) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    });
    return function sendSse(name, data, id) {
      if (name) {
        res.write(`event: ${name}\n`);
      }
      if (id) {
        //data.id = id;
        res.write(`id: ${id}\n`);
      }
      res.write(`data: ${JSON.stringify(data)}\n\n`);
      //res.write(`\n\n`);
    };
  }

  var count = 0,
    interval;

  const router = require('express').Router();

  router
    .route('/event-source/:id?')
    .all((req, res, next) => {
      log.info('use', req.url, req.params);
      return next();
    })
    .get((req, res, next) => {
      let sse = startSees(res);

      clearInterval(interval);
      interval = setInterval(() => {
        count++;
        sse(
          'ping',
          {
            timestamp: new Date().toISOString(),
            message: `Message from the server ${count}`
          },
          req.params.id
        );
      }, req.query.interval || 1000);

      res.once('end', () => {
        count = 0;
        clearInterval(interval);
        console.log('Connection closed');
      });
    });

  app.use(router);
};
