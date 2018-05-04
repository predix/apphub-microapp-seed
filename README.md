# apphub-microapp-seed
This is the microapp seed, which uses [Node](https://nodejs.org/) and [Express](http://expressjs.com/) on the back-end, and [ES6/ES2015](https://babeljs.io/docs/learn-es2015/), [Babel](https://babeljs.io/) and [Webpack](http://webpack.js.org/) on the front-end.

### What's a micro-app?
A micro-app is designed to be loaded into the content area of the [App Hub](https://github.build.ge.com/hubs/ui-app-hub). The AppHub includes the micro-app's `index.html` directly into the content section in its template, and proxies any further resource requests directly to the micro-app itself.

## Whats New?
The build stack is completely new and will change the way you develop applications. For more information on the build stack visit [Webpack](http://webpack.js.org/).


* 


## Getting Started
After you clone the repo.

- Install npm dependencies
  ```
  $ npm install

  // or yarn install
  ```

- Install bower depenencies

  ```
  $ npm run bower
  ```

1. Start NodeJS development server with Webpack middleware

  ```
  $ npm run dev
  ```
  
  * `storybook` - Will start local component server for developing in isolation.
    > For more information about storybook, visit https://storybook.js.org/

2. Test client/server

  ```
  $ npm test
  ```

  * `test:client` - executes client side testing using Jest with Snapshots and Code Coverage
  * `test:server` - executes server side testing using Mocha with Code Coverage.

3. Build client/server for production

  ```
  $ npm run dist
  ```

  > Note: This command will produce an artifact that is ready to be deployed.

4. Deploy

  ```
  $ npm run deploy
  ```

  > Note: This runs `dist` and deploys the contents of the `./dist` directory.

4. 

  ```
  $ npm start
  ```



## Commands

Lifecycle scripts included in apphub-microapp-seed:

```
  start
    cross-env NODE_ENV=production node server
  pretest
    rimraf coverage
  test
    npm run test:server && npm run test:client
```

Available via `npm run-script`:
```

  bower
    bower install --force --allow-root
  prebuild
    rimraf build dist
  build
    cross-env NODE_ENV=production webpack --progress
  build:old
    npm run build:frontend && npm run build:backend
  build:frontend
    cross-env NODE_ENV=production BABEL_ENV=client webpack --progress
  build:backend
    cross-env NODE_ENV=production BUILD_TARGET=backend BABEL_ENV=server webpack --progress
  build:backend:lib
    cross-env NODE_ENV=production BUILD_AS_LIB=true BUILD_TARGET=backend webpack -p
  copy
    cpy 'Dockerfile' 'package.json' 'manifest.yml' 'config.js' '*.md' 'public/**/*.*' ./dist --parents
  clean
    rimraf coverage dist .nyc_output build
  docs
    esdoc
  predeploy
    npm test
  deploy
    npm run dist && cd ./dist && cf push
  predist
    rimraf dist
  dist
    npm run bower && npm run build && npm run copy && npm run zip
  dev
    cross-env NODE_ENV=development node src/server
  docker:build
    docker build -t predix-apphub/$npm_package_name .
  docker:run
    docker run -p 49161:8080 -d predix-apphub/$npm_package_name
  docker:save
    docker save -o $npm_package_name.tar predix-apphub/$npm_package_name
  test:client
    cross-env NODE_ENV=test jest --coverage
  test:server
    cross-env NODE_ENV=test nyc mocha test/server/**/*-spec.js
  test:e2e
    cross-env NODE_ENV=test nightwatch --config ./test/e2e/nightwatch.conf.js
  lint
    eslint ./src --cache
  zip
    cd dist && bestzip ../$npm_package_name-$BUILD_NUMBER.zip *
  storybook
    start-storybook -p 9090 -c .storybook
  storybook:build
    build-storybook -c .storybook -o .out
```


## Directory Structure
The following is the directory structure:

```
server
├── common
│   ├── database.js
│   ├── env.js
│   ├── logger.js
│   ├── server.js
│   └── swagger
│       ├── Api.yaml
│       └── index.js
├── index.js
├── middleware
│   ├── api
│   │   ├── controller.js
│   │   ├── db.js
│   │   ├── index.js
│   │   └── routes.js
│   ├── app
│   │   └── index.js
│   ├── auth
│   │   ├── index.js
│   │   ├── passport.js
│   │   └── user-info.js
│   ├── index.js
│   ├── localize
│   │   ├── index.js
│   │   └── locales
│   │       ├── index.js
│   │       ├── locale-ar.json
│   ├── nav
│   │   ├── controller.js
│   │   ├── index.js
│   │   ├── nav.js
│   │   └── routes.js
│   └── swagger
│       └── index.js
└── nav.json
```

---


## Docker
Here is how to build and run this app as a docker container.

1. Build and run the image: 

```
$ npm run docker:build
$ npm run docker:run
```

3. Print the output of your app:

```
# Get container ID
$ docker ps

# Print app output
$ docker logs <container-id>
```

4. Execute commands inside the image:

```
$ docker exec -it <container-id> /bin/bash
```

5. Test api access to the container:

```
$ curl -i localhost:49160/api
```

6. To build using `docker-compose` simply use:

```
$ docker-compose up
```
---



## Testing
The testing setup is pre-configured to run:

- `test:client` - executes Jest on all ./src/**/*.test.js files.
- `test:server` - executes Mocha on all ./test/server/**/*.js files.
- `test:e2e` - executes NightwatchJS on all ./test/e2e/specs/**/*.js files.
- `test` - excutes both `test:client` and `test:server` commands.

#### 1. Unit tests (Client)
To run unit tests against your server code execute the following:

```
$ npm test:server
```
> Mocha - https://mochajs.org


#### 2. Unit tests (Server)
To run unit tests against your server code execute the following:

```
$ npm test:server
```
> Mocha - https://mochajs.org

> You will get detailed code coverage in the `coverage` directory.


#### 3. E2E tests (Integration)
To run e2e tests launch your application and in a separate terminal execute the following:

```
$ npm run test:e2e
```
> NightwatchJS - http://nightwatchjs.org


