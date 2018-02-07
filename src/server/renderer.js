const React = require('react');
const renderToString = require('react-dom/server').renderToString;
const App = require('../components/App');

module.exports = function serverRenderer({ clientStats, serverStats, foo }) {
   console.log('serverRender');
   return (req, res, next) => {
      res.status(200).send(`
            <!doctype html>
            <html>
            <head>
                <title>${foo}</title>
            </head>
            <body>
                
                <div id="root" class="pxh-view pxh-view--wide@md pxh-view--narrow@lg">
                ${renderToString(React.createElement(App))}
                </div>
                <script src="/main.js"></script>
            </body>
            </html>
        `);
   };
}