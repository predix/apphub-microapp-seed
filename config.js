const path = require('path');
const pkg = require('./package.json');

const Config = {
  appName: pkg.name,
  port: process.env.PORT || 9001,
  pkg: pkg,
	paths: {
		static: path.resolve(__dirname, './static'),
		dest: path.resolve(__dirname, './build'),
		src: path.resolve(__dirname, './src'),
		test: path.resolve(__dirname, './test'),
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
	},


	webpack: {
		devServer: {
			contentBase: [
				path.resolve(__dirname, './bower_components'),
				path.resolve(__dirname, './static'),
				path.resolve(__dirname, './src')
			],

			// TODO: Setup express app,
			before: (app) =>{
        require('./server/app')(app)
				app.get('/api/mock-data', (req, res) => {
					res.json({
						docs: [1,2,3,4,5]
					});
				});
			},

      // TODO: Proxy configuation for webpack-dev-server
			proxy: {
				'/api/v2/**': {
					target: 'https://pouchdb.run.aws-usw02-pr.ice.predix.io',
					pathRewrite: {
						"^/api/v2": ""
					}
				}
			}
		}

	}
	//env: process.env,
	//pkg
};

module.exports = Config;
