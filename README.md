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






#### Server Routes
The routes are loaded via folders by (consign)[https://www.npmjs.com/package/consign].

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
