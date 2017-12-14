const path = require('path');
const pkg = require('./package.json');
const Config = {
  appName: pkg.name,
  port: process.env.PORT || 9001,
  pkg: pkg,
	paths: {
		static: './public',
		dest: './build',
		src: './src',
		test: './test',
		modules: [
			path.resolve(__dirname, './src'),
			path.resolve(__dirname, './vendor'),
			path.resolve(__dirname, './node_modules'),
			path.resolve(__dirname, './bower_components')
		],
		alias: {
			components: path.resolve(__dirname, './src/components'),
			services: path.resolve(__dirname, './src/services'),
			pages: path.resolve(__dirname, './src/pages'),
			style: path.resolve(__dirname, './src/style')
		}
	},
	env: {
		production: process.env.NODE_ENV === 'production',
		test: process.env.NODE_ENV === 'test'
	}
};

module.exports = Config;
