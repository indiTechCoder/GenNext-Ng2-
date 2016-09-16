# Angular 2 RESTful Service Example

This project provides a simple look at getting started using Angular 2 
to call into a RESTful service. Simply clone the project or download and extract the .zip to get started. 

## Angular 2 Concepts Covered

* Using TypeScript classes and modules
* Modules are loaded with System.js
* Using Custom Components
* Using the Http object for Ajax calls along with RxJS observables
* Performing GET and PUT requests to the server
* Working with Angular 2 service classes for Ajax calls
* Using Angular 2 databinding and built-in directives

## Software Requirements To Run Locally (there's a Docker option below as well)

* Node.js 4.0.0 or higher
* MongoDB 3.2 or higher

### Loading MongoDB Data

Load data into MongoDB by performing the following steps:

* Install MongoDB (https://docs.mongodb.org/manual/installation) on your machine
* Execute 'mongod' to start the MongoDB daemon if it's not already running
* Open a command window and navigate to the `angular2-restfulservice` directory 
* Run `node lib/dbSeeder.js` to insert the sample data (exit with ctrl + c)

### Running the Application Locally

1. Install Node.js and MongoDB on your dev box

1. Open `config/config.development.json` and change the host from `mongodb` to `localhost`

1. Install supervisor: `npm install supervisor -g`

1. Run `npm install` to install app dependencies

1. Run `npm start` to compile the TypeScript and start the server

1. Browse to http://localhost:3000

## Running the Application with Docker

1. Install Docker for Mac/Windows or Docker Toolbox - https://www.docker.com/products/overview

1. Open a command prompt window

1. Run `npm install`

1. Run `npm run tsc:w` to compile TypeScript to JavaScript locally (leave the window running). This is only needed when in "dev" mode.

1. Open another command window and navigate to this application's root folder in the command window

1. Run `docker-compose build` to build the images

1. Run `docker-compose up` to run the containers

1. Navigate to http://localhost:3000 if using Docker for Mac/Windows or http://192.168.99.100:3000 if using Docker Toolbox in a browser

1. Live long and prosper

Note: To run the "production" build follow the instructions in docker-compose.production.yml. The local files are copied into
the image with this mode so no need to have the tsc:w task running unless you're going to continue local development.


#  Little  Bit about Angular Redux

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API](#api)
- [Dependency Injectable Middleware](#dependency-injectable-middleware)
- [Routers](#routers)
- [Using DevTools](#using-devtools)
- [Additional Resources](#additional-resources)


## Installation
#### npm
```js
npm install --save ng-redux
```
#### bower
```js
bower install --save ng-redux
```

Add the following script tag to your html:

```html
<script src="bower_components/ng-redux/dist/ng-redux.js"></script>
```

## Quick Start

#### Initialization

You can either pass a function or an object to `createStoreWith`.

With a function:

```JS
import reducers from './reducers';
import { combineReducers } from 'redux';
import loggingMiddleware from './loggingMiddleware';
import ngRedux from 'ng-redux';

angular.module('app', [ngRedux])
.config(($ngReduxProvider) => {
    let reducer = combineReducers(reducers);
    $ngReduxProvider.createStoreWith(reducer, ['promiseMiddleware', loggingMiddleware]);
  });
```

With an object:

```JS
import reducers from './reducers';
import { combineReducers } from 'redux';
import loggingMiddleware from './loggingMiddleware';
import ngRedux from 'ng-redux';
import reducer3 from './reducer3';

angular.module('app', [ngRedux])
.config(($ngReduxProvider) => {
	reducer3 = function(state, action){}
    $ngReduxProvider.createStoreWith({
		reducer1: "reducer1",
		reducer2: function(state, action){},
		reducer3: reducer3
	 }, ['promiseMiddleware', loggingMiddleware]);
  });
```
In this example `reducer1` will be resolved using angular's DI after the config phase.

#### Usage

*Using controllerAs syntax*
```JS
import * as CounterActions from '../actions/counter';

class CounterController {
  constructor($ngRedux, $scope) {
    /* ngRedux will merge the requested state's slice and actions onto this, 
    you don't need to redefine them in your controller */
    
    let unsubscribe = $ngRedux.connect(this.mapStateToThis, CounterActions)(this);
    $scope.$on('$destroy', unsubscribe);
  }

  // Which part of the Redux global state does our component want to receive?
  mapStateToThis(state) {
    return {
      value: state.counter
    };
  }
}
```

```HTML
<div>
    <p>Clicked: {{counter.value}} times </p>
    <button ng-click='counter.increment()'>+</button>
    <button ng-click='counter.decrement()'>-</button>
    <button ng-click='counter.incrementIfOdd()'>Increment if odd</button>
    <button ng-click='counter.incrementAsync()'>Increment Async</button>
</div>
```

## API

### `createStoreWith(reducer, [middlewares], [storeEnhancers], [initialState])`

Creates the Redux store, and allow `connect()` to access it.

#### Arguments: 
* `reducer` \(*Function*): A single reducer composed of all other reducers (create with redux.combineReducer)
* [`middlewares`] \(*Function[]*): Optional, An array containing all the middleware that should be applied. Functions and strings are both valid members. String will be resolved via Angular, allowing you to use dependency injection in your middlewares.
* [`storeEnhancers`] \(*Function[]*): Optional, this will be used to create the store, in most cases you don't need to pass anything, see [Store Enhancer official documentation.](http://rackt.github.io/redux/docs/Glossary.html#store-enhancer)
* [`initialState`] \(*Object*): Optional, the initial state of your Redux store.


### `connect(mapStateToTarget, [mapDispatchToTarget])(target)`

Connects an Angular component to Redux.

#### Arguments
* `mapStateToTarget` \(*Function*): connect will subscribe to Redux store updates. Any time it updates, mapStateToTarget will be called. Its result must be a plain object or a function returning a plain object, and it will be merged into `target`. If you have a component which simply triggers actions without needing any state you can pass null to `mapStateToTarget`.
* [`mapDispatchToTarget`] \(*Object* or *Function*): Optional. If an object is passed, each function inside it will be assumed to be a Redux action creator. An object with the same function names, but bound to a Redux store, will be merged onto `target`. If a function is passed, it will be given `dispatch`. It’s up to you to return an object that somehow uses `dispatch` to bind action creators in your own way. (Tip: you may use the [`bindActionCreators()`](http://gaearon.github.io/redux/docs/api/bindActionCreators.html) helper from Redux.).

*You then need to invoke the function a second time, with `target` as parameter:*
* `target` \(*Object* or *Function*): If passed an object, the results of `mapStateToTarget` and `mapDispatchToTarget` will be merged onto it. If passed a function, the function will receive the results of `mapStateToTarget` and `mapDispatchToTarget` as parameters.

e.g:
```JS 
connect(this.mapState, this.mapDispatch)(this);
//Or
connect(this.mapState, this.mapDispatch)((selectedState, actions) => {/* ... */});

```
#### Returns
Returns a *Function* allowing to unsubscribe from further store updates.

#### Remarks
* The `mapStateToTarget` function takes a single argument of the entire Redux store’s state and returns an object to be passed as props. It is often called a selector. Use reselect to efficiently compose selectors and compute derived data. You can also choose to use per-instance memoization by having a `mapStateToTarget` function returning a function of state, see [Sharing selectors across multiple components](https://github.com/reactjs/reselect#user-content-sharing-selectors-with-props-across-multiple-components)



### Store API
All of redux's store methods (i.e. `dispatch`, `subscribe` and `getState`) are exposed by $ngRedux and can be accessed directly. For example:

```JS
$ngRedux.subscribe(() => {
    let state = $ngRedux.getState();
    //...
})
```

This means that you are free to use Redux basic API in advanced cases where `connect`'s API would not fill your needs.

## Dependency Injectable Middleware
You can use angularjs dependency injection mechanism to resolve dependencies inside a `middleware`.
To do so, define a factory returning a middleware:

```Javascript
function myInjectableMiddleware($http, anotherDependency) {
    return store => next => action => {
        //middleware's code
    }
}

angular.factory('myInjectableMiddleware', myInjectableMiddleware);
```

And simply register your middleware during store creation:

```Javascript
$ngReduxProvider.createStoreWith(reducers, [thunk, 'myInjectableMiddleware']);
```

Middlewares passed as **string** will then be resolved throught angular's injector.

## Routers
See [redux-ui-router](https://github.com/neilff/redux-ui-router) to make ng-redux and UI-Router work together. <br>
See [ng-redux-router](https://github.com/amitport/ng-redux-router) to make ng-redux and angular-route work together.

## Using DevTools
In order to use Redux DevTools with your angular app, you need to install [react](https://www.npmjs.com/package/react), [react-redux](https://www.npmjs.com/package/react-redux) and [redux-devtools](https://www.npmjs.com/package/redux-devtools) as development dependencies.

```JS
[...]
import { devTools, persistState } from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import React, { Component } from 'react';

angular.module('app', ['ngRedux'])
  .config(($ngReduxProvider) => {
      $ngReduxProvider.createStoreWith(rootReducer, [thunk], [devTools()]);
    })
  .run(($ngRedux, $rootScope) => {
    React.render(
      <App store={ $ngRedux }/>,
      document.getElementById('devTools')
    );
    
    //To reflect state changes when disabling/enabling actions via the monitor
    //there is probably a smarter way to achieve that
    $ngRedux.subscribe(_ => {
        setTimeout($rootScope.$apply, 100);
    });
  });
  
  class App extends Component {
  render() {
    return (
      <div>
        <DebugPanel top right bottom>
          <DevTools store={ this.props.store } monitor = { LogMonitor } />
        </DebugPanel>
      </div>
    );
  }
}
```

```HTML
<body>
    <div ng-app='app'>
      [...]
    </div>
    <div id="devTools"></div>
</body>
```

## Additional Resources
* [Managing state with Redux and Angular](http://blog.rangle.io/managing-state-redux-angular/)