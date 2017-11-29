'use strict';

// This node application copies the files specified in the 'files' array to our CDN,
// and updates your application's main page to point to those files on the CDN.

//
// Usage:
//   node cdnify.js (-v <version>) (-d)
//
// Options:
//   -v (string) Version (optional, package.json used if not provided)
//   -d (null)   Dry run. Does everything but upload to the CDN. Optional
//
// Dependencies:
//   process.env.AWS_ACCESS_KEY
//   process.env.AWS_SECRET_ACCESS_KEY
//   process.env.HTTP_PROXY
const pkg = require('../package.json');
const args = require('minimist')(process.argv.slice(2), {
  '--': true,
  alias: {
    v: 'version',
    d: 'dryrun'
  }
});
const fs = require('fs-extra');
const cdn = require('predix-cdn');

// #######################################################
// CONFIGURATION

// Get the app name & version from package.json. This must be unique!
const appName = pkg.name;
const version = args.v || pkg.version;

const options = {
  name: pkg.name, // Must be unique!
  version: version,
  dryrun: args.d,
  // Where do we read files from?
  root: 'dist/public/',
  // Where's your main page (usually index.html)
  content: 'index.html',
  // Which files in root do we want to upload to the CDN?
  files: [
    'styles/app.css',
    'styles/app.min.css',
    'config.js',
    'bundle.js',
    'bundle.js.map',
    'polymer_loader.html'
  ]
};

// END CONFIGURATION
// #######################################################

// CDNify everything in `root` and upload those files
cdn.cdnify(options);
