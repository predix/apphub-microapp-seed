# apphub-microapp-seed

This is the microapp seed, which uses:

- [Node](https://nodejs.org)
- [Express](http://expressjs.com)
- [React](https://reactjs.org)
- [Predix-UI](https://jonniespratley.github.io/predix-ui)
- [Jest](https://facebook.github.io/jest)
- [Webpack](http://webpack.js.org)

### What's a micro-app?

A micro-app is designed to be loaded into the content area of the [AppHub](https://www.predix.io/services/service.html?id=2472).


## Whats New?

The stack is completely new and will change the way you develop applications.

## Quick Start

After you clone the repo.

- Install npm dependencies
  
```
$ npm install
```

- Install bower depenencies

```
$ npm run bower
```

> Note: This will be depricated as bower is no longer maintained.

- Start NodeJS development server with Webpack middleware

```
$ npm run dev
```
  
- Test client/server

```
$ npm test
```

> Executes testing using Jest with Snapshots and Code Coverage

- Build client/server for production

```
$ npm run dist
```

> Note: This command will produce (`dist` and `apphub-microapp-seed.x.x.x.zip`) artifact to be deployed.

1. Deploy to Cloud Foundry

  ```
  $ npm run deploy
  ```

> Note: This runs the `dist` command and deploys the contents of the `./dist` directory.


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

- `test` - executes Jest on all ./src/**/*.test.js files.
- `test:e2e` - executes NightwatchJS on all ./test/e2e/specs/**/*.js files.

#### 1. Unit tests (Client/Server)

To run unit tests using Jest execute the following:

```
$ npm test
```

> Jest - [https://facebook.github.io/jest](https://facebook.github.io/jest)

> You will get detailed code coverage in the `coverage` directory.

#### 3. E2E tests (Integration)

To run e2e tests launch your application and in a separate terminal execute the following:

```
$ npm run test:e2e
```

> NightwatchJS - http://nightwatchjs.org

