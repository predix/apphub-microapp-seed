'use strict';
const express = require('express');
const log = require('debug')('ui-microapp:server');
const config = require('../config');
require('./app').boot((err) => {
	if (err) {
		throw err;
	}
	console.log(`> Ready on http://:${config.port}`);
});
