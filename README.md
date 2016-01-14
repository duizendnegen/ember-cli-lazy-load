# Ember-ClI-Lazy-Load

This README outlines the details of collaborating on the Ember-CLI-Lazy-Load addon [here](https://github.com/B-Stefan/ember-cli-lazy-load-example) you find an [exmaple app](https://github.com/B-Stefan/ember-cli-lazy-load-example) that use this addon: 

## Installation

* `ember install ember-cli-lazy-load`  for ember-cli@2.2.0-beta.6 and compatible with ember@1.* and ember@2.2.*  
* `ember install ember-cli-lazy-load@0.0.6`  for ember-cli@1.* and compatible with ember@1.*  



## Getting started 


#### 1. Configure your bundles in config/bundes.js 

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



#### 2. Modify your config/environment.js and include there the bundle files 

```javascript
    var bundles = require("./bundles")
    module.exports = function(environment) {
      var ENV = {
        bundles: bundles(environment),
```

#### 3. Modify your ember-cli-build.js to use the custom bundle build flow. 

```javascript
var EmberApp = require("ember-cli-lazy-load/ember-app");
var bundles = require("./config/bundles")();

module.exports = function(defaults) {

  var app = new EmberApp(defaults, {
    // Add options here
    bundles: bundles
  }


````

#### 4. Add Mixin to your routes 

To enable the automatic loading of the bundles when the user change the route add the mixin to your route: 

```javascript

import Ember from "ember";
import LazyRouteMixin from 'ember-cli-lazy-load/mixins/lazy-route';

export default Ember.Route.extend(LazyRouteMixin,{

   
});

```

if you already override the beforeModel function ensure that you execute the super call before the rest and wait for the result.

```javascript


import Ember from "ember";
import LazyRouteMixin from 'ember-cli-lazy-load/mixins/lazy-route';

export default Ember.Route.extend(LazyRouteMixin,{

  beforeModel: function(transition, queryParams){
          return this._super(transition,queryParams).then(()=>{
              console.log("code after the bundle load");
          });
      }

   
});


```
 

## Services / Mixin

###bundle-loader Service

The bundle loader provide the ability to load bundles. 

* loadBundle(bundleName:string):Promise() - Load the bundle and there dependencies 


###lazy-route Mixin 
The mixin override the beforeModel(transition, queryParams) function. 
If you use this function already in you route be sure that you call first this method and wait for the promise!  


* findBundleByRouteName(routeName:string):string - get the bundle for the route, undefined if no bundle found 
* beforeModel(transition, queryParams):Promise  - loads the bundle if there is one for this route 


## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
