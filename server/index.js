const express = require('express');
const config = require('../config');
const log = require('./logger')('server');

require('./app')().boot((err) => {
	if (err) {
		throw err;
	}
	log.info(`> Ready on http://:${config.port}`);
});
