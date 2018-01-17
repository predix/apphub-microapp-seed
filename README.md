# apphub-microapp-seed
This is the microapp seed, which uses [Node](https://nodejs.org/) and [Express](http://expressjs.com/) on the back-end, and [ES6/ES2015](https://babeljs.io/docs/learn-es2015/), [Babel](https://babeljs.io/) and [Webpack](http://webpack.js.org/) on the front-end.

### What's a micro-app?
A micro-app is designed to be loaded into the content area of the [App Hub](https://github.build.ge.com/hubs/ui-app-hub). The AppHub includes the micro-app's `index.html` directly into the content section in its template, and proxies any further resource requests directly to the micro-app itself.

## Whats New?
The build stack is completely new and will change the way you develop applications. For more information on the build stack visit [Webpack](http://webpack.js.org/).


## Getting Started
After you clone the repo.

```
$ yarn install
```

1. Develop

  ```
  $ yarn dev
  ```
  
2. Test

  ```
  $ yarn test
  ```

3. Build 

  ```
  $ yarn build
  ```
  
4. Deploy

  ```
  $ yarn deploy
  ```
  
4. Start

  ```
  $ yarn start
  ```



## Directory Structure
The following is the directory structure:

```
.
├── public
│   ├── api-explorer
│   ├── assets
│   └── favicon.ico
├── server
│   ├── common
│   ├── controllers
│   ├── locales
│   ├── middleware
│   ├── models
│   ├── index.js
│   └── nav.json
├── src
│   ├── components
│   ├── style
│   ├── config.json
│   ├── index.ejs
│   ├── main.js
│   ├── manifest.json
│   └── pwa.js
├── test
│   ├── e2e
│   ├── server
│   └── helpers.js
├── tools
│   ├── README.md
│   ├── build.sh
│   └── create-setup-uaa.sh
├── Dockerfile
├── Jenkinsfile
├── LICENSE.md
├── README.md
├── bower.json
├── config.js
├── manifest.yml
├── package.json
├── postcss.config.js
├── webpack.config.js
├── whitesource.config.json
└── yarn.lock
```

---


## Server
The server controllers/models/middleware are setup in different folders. 
> The routes are loaded via folders by (consign)[https://www.npmjs.com/package/consign].

For example:

```
server/controllers/
└── nav
    ├── controller.js
    └── routes.js
```

Here is `server/controllers/nav/routes.js` file contents:

```js
/**
 * @description Nav Router
 */
module.exports = (app) => {
  const log = app.middleware.application.getLogger('controllers:nav');
  const controller = app.controllers.nav.controller;

  app
    .route(['/nav','/api/nav'])
    .all(controller.all)
    .get(controller.get)
    .put(controller.put)
    .post(controller.post)
    .delete(controller.delete);

  return this;
};
```

Here is `server/controllers/nav/controller.js` file contents:

```js
/**
 * @description NavController - handles CRUD for navigation items.
 */
class NavController {
  all(req, res, next){
    next();
  }
  get(req, res, next){
    req.app.models.nav.read()
      .then(n => res.status(200).send(n))
      .catch(next);
  }
  put(req, res, next){
    req.app.models.nav
      .update(req.body)
      .then(r => res.status(200).send(r))
      .catch(next);
  }
  post(req, res, next){
    if(req.body){
      req.app.models.nav
        .update(req.body)
        .then(r => res.status(201).send(r))
        .catch(next);
    } else {
      res.status(400).send({error:'Must provide a request body'});
    }
  }
  delete(req, res, next){
    res.status(200).json({
      message: 'Removed',
      headers: req.headers
    });
  }
}
module.exports = new NavController();
```

As you can see the code is clean and modular.

---


## Docker
Here is how to build and run this app as a docker container.

1. Build the image: 

```
$ yarn docker:build
```

2. Run the image:

```
$ yarn docker:run
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

---



## Testing
The following is the contents of the `test` directory:

```
test
├── e2e
│   ├── commands
│   ├── globals.js
│   ├── nightwatch.conf.js
│   ├── pages
│   └── specs
├── helpers.js
└── server
    ├── app-spec.js
    ├── common
    └── controllers
        └── nav-spec.js
```

The testing setup is pre-configured to run Nightwatch as the e2e runner and Mocha for the server.

### E2E tests
To run e2e tests launch your application and in a separate terminal execute the following:

```
$ yarn test:e2e
```

### Unit tests
To run unit tests against your server code execute the following:

```
$ yarn test
```
> You will get detailed code coverage in the `coverage` directory.

### Technologies
- Nightwatch - http://nightwatchjs.org/gettingstarted
- Mocha - https://mochajs.org/
