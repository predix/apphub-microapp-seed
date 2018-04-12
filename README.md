# apphub-microapp-seed
This is the microapp seed, which uses [Node](https://nodejs.org/) and [Express](http://expressjs.com/) on the back-end, and [ES6/ES2015](https://babeljs.io/docs/learn-es2015/), [Babel](https://babeljs.io/) and [Webpack](http://webpack.js.org/) on the front-end.

### What's a micro-app?
A micro-app is designed to be loaded into the content area of the [App Hub](https://github.build.ge.com/hubs/ui-app-hub). The AppHub includes the micro-app's `index.html` directly into the content section in its template, and proxies any further resource requests directly to the micro-app itself.

## Whats New?
The build stack is completely new and will change the way you develop applications. For more information on the build stack visit [Webpack](http://webpack.js.org/).


## Getting Started
After you clone the repo.

- Install npm dependencies
  ```
  $ npm install
  ```

- Install bower depenencies

  ```
  $ npm run bower
  ```

1. Start local dev server

  ```
  $ npm run dev
  //or develop in isolation
  $ npm run storybook
  ```
  

2. Test client/server

  ```
  $ npm test
  ```

3. Build client/server for production

  ```
  $ npm run dist
  ```

4. Deploy

  ```
  $ npm run deploy
  ```

4. Start

  ```
  $ npm start
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
│   │       ├── locale-de.json
│   │       ├── locale-en.json
│   │       ├── locale-es.json
│   │       ├── locale-hi.json
│   │       └── locale-zh.json
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

1. Build the image: 

```
$ npm run docker:build
```

2. Run the image:

```
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
The following is the contents of the `test` directory:

```
test
├── e2e
│   ├── commands
│   │   ├── loginUser.js
│   │   └── logoutUser.js
│   ├── globals.js
│   ├── nightwatch.conf.js
│   ├── pages
│   │   ├── app.js
│   │   └── login.js
│   └── specs
│       ├── 0-app-spec.js
│       └── 1-login-spec.js
├── helpers.js
└── server
    ├── common
    │   ├── db-spec.js
    │   ├── logger-spec.js
    │   └── server-spec.js
    └── middleware
        ├── api-spec.js
        ├── app-spec.js
        ├── auth-spec.js
        └── nav-spec.js

7 directories, 16 files
```

The testing setup is pre-configured to run Nightwatch as the e2e runner and Mocha for the server.

### E2E tests
To run e2e tests launch your application and in a separate terminal execute the following:

```
$ npm run test:e2e
```

### Unit tests
To run unit tests against your server code execute the following:

```
$ npm test
```
> You will get detailed code coverage in the `coverage` directory.

### Technologies
- Nightwatch - http://nightwatchjs.org/gettingstarted
- Mocha - https://mochajs.org/
