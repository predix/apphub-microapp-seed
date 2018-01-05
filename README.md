# Microapp Base Seed
This is the microapp seed, which uses [Node](https://nodejs.org/) and [Express](http://expressjs.com/) on the back-end, and [ES6/ES2015](https://babeljs.io/docs/learn-es2015/), [Babel](https://babeljs.io/) and [Webpack](http://webpack.js.org/) on the front-end.

### What's a microapp?
A microapp is designed to be loaded into the main content area of the [App Hub](https://github.build.ge.com/hubs/ui-app-hub). The App Hub includes the microapp's `index.html` directly into the content section in its template, and proxies any further resource requests directly to the microapp itself.


## Whats New?
The build stack is completly new and will change the way you develop.

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


## Development
For development we use `webpack` which provides some awesome features, you can read more about it on there documentation page https://webpack.js.org/concepts/



### Directory Structure
The following is the directly structure.

```
.
├── Jenkinsfile
├── LICENSE.md
├── README.md
├── bower.json
├── config.js
├── manifest.yml
├── nightwatch.conf.js
├── package-lock.json
├── package.json
├── postcss.config.js
├── public
│   └── api-explorer
├── server
│   ├── common
│   │   ├── database.js
│   │   ├── env.js
│   │   ├── logger.js
│   │   ├── server.js
│   │   └── swagger
│   │       ├── Api.yaml
│   │       └── index.js
│   ├── config
│   │   ├── development.js
│   │   ├── production.js
│   │   └── staging.js
│   ├── controllers
│   │   ├── api
│   │   │   ├── controller.js
│   │   │   └── routes.js
│   │   └── nav
│   │       ├── controller.js
│   │       └── routes.js
│   ├── index.js
│   ├── lingo.js
│   ├── middleware
│   │   ├── application.js
│   │   ├── swagger.js
│   │   └── user.js
│   ├── models
│   │   ├── database.js
│   │   ├── example.js
│   │   ├── nav.js
│   │   └── user.js
│   └── nav.json
├── src
│   ├── components
│   │   └── app.js
│   ├── index.ejs
│   ├── main.js
│   ├── manifest.json
│   ├── pwa.js
│   └── style
│       ├── _mixins.scss
│       ├── _variables.scss
│       ├── helpers.scss
│       ├── index.scss
│       └── theme.scss
├── static
│   ├── assets
│   │   └── icons
│   ├── favicon.ico
│   └── locales
│       ├── index.js
│       ├── locale-ar.json
│       ├── locale-de.json
│       ├── locale-en.json
│       ├── locale-es.json
│       ├── locale-hi.json
│       └── locale-zh.json
├── test
│   ├── e2e
│   ├── helpers.js
│   └── server
│       ├── app-spec.js
│       ├── common
│       │   ├── db-spec.js
│       │   └── logger-spec.js
│       └── controllers
│           ├── api-spec.js
│           └── nav-spec.js
├── tools
│   ├── build.sh
│   ├── buildLocal.sh
│   └── cdnify.js
├── webpack.config.js
├── whitesource.config.json
└── yarn.lock
```




#### Server Routes
The routes are loaded via folders by (consign)[https://www.npmjs.com/package/consign].



The server routes are setup in different folders. For example for `/api/nav` routes, here is how it looks.

```
./server
  /controllers
    /nav
      routes.js
      controller.js
```

Here is what the `server/controllers/nav/routes.js` file looks like:

```
/**
 * @description Nav Router
 */
module.exports = (app) => {
  const log = app.middleware.application.getLogger('controllers:nav');
  const controller = app.controllers.nav.controller;

  app
    .route('/api/nav')
    .all(controller.all)
    .get(controller.get)
    .put(controller.put)
    .post(controller.post)
    .delete(controller.delete);

  return this;
};
```

Here is what the `server/controllers/nav/controller.js` file looks like:

```
/**
 * @description Nav Controller
 */
class NavController {
  constructor(){
  }
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





If you had nested folders like the following example:

```
models
	humans
		cool.js
		not.js
	animals
		dog.js
		cat.js
```  

You would end up with the scripts being available in the following structure:

```
app.models.humans.cool
app.models.humans.not
app.models.animals.dog
app.models.animals.cat
```


## Docker
Here is how to build and run this app as a docker container.


1. Build the image: 

```
$ docker build -t <username>/apphub-microapp-seed .
```

2. Run the image:

```
$ docker run -p 49160:8080 -d <username>/apphub-microapp-seed
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






## Testing
The testing setup is as follows:

```
test/
  e2e
  server
  client
```

- e2e testing with Nightwatch - http://nightwatchjs.org/gettingstarted
- Server testing with mocha - https://mochajs.org/
- Client testing with mocha - https://mochajs.org/
