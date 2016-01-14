/* jshint node: true */

/**
 * Configuration for bundles
 * @returns {*}
 */
module.exports = function(environment) {

    return {


        //index: {
        //    files: [                       // You can specify pattern you want, this options is directly used in a broccoli-funnel
        //        "**/templates/index.js",
        //        "**/controllers/index.js",
        //        "**/components/my-item/**.js"
        //    ],
        //
        //    routes: ["index", "..."]      //If the user will translate to one of this route names the bundle gets loaded, this is optional
        //},
        //about: {
        //    files: [
        //        "**/templates/about.js",
        //        "**/controllers/about.js",
        //        "**/components/my-cat/**.js"
        //    ],
        //    dependencies: ["index"],      //If the content of your bundle depend on something from an other bundle you can specify this here
        //    routes: ["about", "more routes for this bundle "]
        //}
    }

};
