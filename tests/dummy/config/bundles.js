/* jshint node: true */

/**
 * Configuration for bundles
 * @returns {*}
 */
module.exports = function(environment) {

   return {
       index: {
           files: [
               "**/templates/index.js",
               "**/controllers/index.js",
               "**/components/my-item/**.js"
           ],

           routes: ["index", "..."]
       },
       about: {
           files: [
               "**/templates/about.js",
               "**/controllers/about.js",
               "**/components/my-cat/**.js"
           ],
           dependencies: ["index"],
           routes: ["about", "more routes for this bundle "]
       }
   }

};
