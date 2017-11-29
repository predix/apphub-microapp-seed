module.exports = function(app) {
  console.log('routes.js - Add your routes here');

  app.use('/nav', (req, res) => {
    const translate = req.t; //this is the lingo translator
    res.status(200).send([
      {
        label: translate('APPLICATION_NAME'),
        icon: 'fa-wrench',
        path: '/#/',
        badge: {
          status: 'important',
          count: 22
        },
        items: [
          {
            label: translate('SUB_ITEM_1'),
            path: '/#/subnav1',
            badge: {
              status: 'warning',
              count: 3
            }
          }, {
            label: translate('SUB_ITEM_2'),
            path: '/#/subnav2',
            badge: {
              status: 'info',
              count: 34
            }
          }, {
            label: translate('SUB_ITEM_3'),
            path: '/?chromeless=true/#/subnav3',
            target: '_blank',
            badge: {
              status: 'error',
              count: 2
            }
          }, {
            label: translate('SUB_ITEM_4'),
            path: 'javascript:window.openMymodal()',
            badge: {
              status: 'info',
              count: 1
            }
          }, {
            label: translate('SOCKET_IO_EXAMPLE'),
            path: '/#/socketio',
            badge: {
              status: 'info',
              count: 0
            }
          }
        ]
      }
    ])
  });
};
