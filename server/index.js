require('./common/env');
const config = require('../config');
const Server = require('./common/server');
const log = require('./common/logger')('server');

const app = new Server(null, config)
	.router()
	.listen(process.env.PORT);

module.exports = app
