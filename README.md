# Ember-cli-lazy-load

Ember Cli Lazy Load supports lazily loading your Ember application, by splitting the app up into bundles. It comes with [a dummy app](https://github.com/duizendnegen/ember-cli-lazy-load/tree/master/tests/dummy) that implements a basic lazy loading scenario.

Requirements: `ember-cli` == 2.2.0

Whenever [ember-engines](https://github.com/dgeb/ember-engines) land their version of lazy loading, this add-on will be deprecated.

## Installation

* `ember install ember-cli-lazy-load`

## Getting started

#### 1. Configure your bundles in `config/bundles.js`

```javascript

index: {
  //Minisearch file patterns for the content of the bundle
  files: [
    "**/templates/index.js",
    "**/controllers/index.js",
    "**/components/my-cat/**.js"
  ],

  //The name of the routes if you are using the lazy-route mixin, no minisearch expressions are allowed here.
  routes: ["index", "..."]
  //The dependencies for this bundle. They will loaded in the same batch as the actual bundle
  dependencies: ["about"],
},
about: {
  files: [
    "**/templates/about.js",
    "**/controllers/about.js",
    "**/components/my-item/**.js"
  ],
  routes: ["about", "more routes for this bundle "]
}
```



#### 2. Modify `config/environment.js` to include the bundle files

```javascript
var bundles = require("./bundles");
module.exports = function(environment) {
  var ENV = {
    bundles: bundles(environment),
```

#### 3. Modify your `ember-cli-build.js` to use the custom bundle build flow.

```javascript
var EmberApp = require("ember-cli-lazy-load/ember-app");
var bundles = require("./config/bundles")();

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
    bundles: bundles
  }
```

#### 4. Add Mixin to your routes

```javascript

import Ember from "ember";
import LazyRouteMixin from 'ember-cli-lazy-load/mixins/lazy-route';

export default Ember.Route.extend(LazyRouteMixin, {});

```

if you already override `beforeModel`, ensure that you execute and await the super call:

```javascript
import Ember from "ember";
import LazyRouteMixin from 'ember-cli-lazy-load/mixins/lazy-route';

export default Ember.Route.extend(LazyRouteMixin,{
  beforeModel: function(transition, queryParams){
      return this._super(transition,queryParams).then(()=>{
        // do the other beforeModel operations
      });
    }
});
```

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`
