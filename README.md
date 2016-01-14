# Ember-ClI-Lazy-Load

This README outlines the details of collaborating on the Ember-CLI-Lazy-Load addon.

## Installation

* `ember install ember-cli-lazy-load` 

## Getting started 


1. Configure your bundles in config/bundes.js 

```javascript 

        //index: {
        //    files: [
        //        "**/templates/index.js",
        //        "**/controllers/index.js",
        //        "**/components/my-item/**.js"
        //    ],
        //
        //    routes: ["index", "..."]
        //},
        //about: {
        //    files: [
        //        "**/templates/about.js",
        //        "**/controllers/about.js",
        //        "**/components/my-cat/**.js"
        //    ],
        //    dependencies: ["index"],
        //    routes: ["about", "more routes for this bundle "]
        //}
```


2. Modify your config/environment.js and include there the bundle files 

```
    var bundles = require("./bundles")
    module.exports = function(environment) {
      var ENV = {
        bundles: bundles(environment),
```

3. Modify your ember-cli-build.js to use the custom bundle build flow. 





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
