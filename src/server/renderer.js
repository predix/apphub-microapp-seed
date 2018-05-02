/**
 *
 * This would be used if we rendered on the server, but instead we are just rendering on the client.
 */
// const React = require('react');
// const renderToString = require('react-dom/server').renderToString;
// import express from 'express';
import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactDOMServer, { renderToString } from 'react-dom/server';
import App from '../components/App';

function handleRender(req, res) {
  // Renders our Hello component into an HTML string
  const html = ReactDOMServer.renderToString(<App />);

  // Load contents of index.html
  fs.readFile('./index.html', 'utf8', function (err, data) {
    if (err) throw err;

    // Inserts the rendered React HTML into our main div
    const document = data.replace(/<div id="root"><\/div>/, `<div id="root">${html}</div>`);

    // Sends the response back to the client
    res.send(document);
  });
}

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
};
