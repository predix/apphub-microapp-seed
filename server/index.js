require('./common/env');
const config = require('../config');
const Server = require('./common/server');
const log = require('./common/logger')('server');

module.exports = new Server(config)
	.router()
	.listen(process.env.PORT);
