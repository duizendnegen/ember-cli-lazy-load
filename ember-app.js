/*jshint node:true*/
/* global require, module */
'use strict';
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var EOL          = require('os').EOL;
var Funnel      = require('broccoli-funnel');

var upstreamMergeTrees = require('broccoli-merge-trees');

var mergeTrees  = function(inputTree, options) {
    options = options || {};
    options.description = options.annotation;
    var tree = upstreamMergeTrees(inputTree, options);

    tree.description = options && options.description;

    return tree;
};

/**
 * @class:  EmberApp
 * @desc:   Extending the Ember app to support multiple bundles
 *
 *  Available init options: see: ember-cli/lib/broccoli/ember-app
 - bundles: [
 {
     fileName: "index"
     pattern: ["** /index.js", "** /index.hbs"]
 }
 ]

 *
 */
var EmberAppBundle = function(){

    EmberApp.apply(this,arguments);

    var options;

    if(arguments.length == 2){
        options = arguments[1]
    }else if(arguments.length == 1) {
        options = arguments[0]
    }else {
        options = {}
    }

    this.bundleCofig = options.bundles ? options.bundles : {}

};

EmberAppBundle.prototype = Object.create(EmberApp.prototype);
EmberAppBundle.prototype.constructor = EmberAppBundle;


EmberAppBundle.prototype.javascript = function(){


    var applicationJs       = this.appAndDependencies();
    var legacyFilesToAppend = this.legacyFilesToAppend;
    var appOutputPath       = this.options.outputPaths.app.js;
    var appJs = applicationJs;

    // Note: If ember-cli-babel is installed we have already performed the transpilation at this point
    if (!this._addonInstalled('ember-cli-babel')) {
        appJs = new Babel(
            new Funnel(applicationJs, {
                include: [escapeRegExp(this.name + '/') + '**/*.js'],
                annotation: 'Funnel: App JS Files'
            }),
            merge(this._prunedBabelOptions())
        );
    }

    var AllAppJs = mergeTrees([
        appJs,
        this._processedEmberCLITree()
    ], {
        annotation: 'TreeMerger (appJS  & processedEmberCLITree)',
        overwrite: true
    });




    /**
     * Exclude the bundle files from the main file
     * #
     */
    var excludedFiles  = Object.keys(this.bundleCofig).map(function(key){
        return this.bundleCofig[key].files;
    },this);

    //Flattern array
    excludedFiles = [].concat.apply([],excludedFiles);


    appJs = new Funnel(AllAppJs, {
        exclude: excludedFiles,
        getDestinationPath: function(relativePath) {
            return relativePath;
        }

    });

    //Create the main file
    var inputFiles = ['vendor/ember-cli/vendor-prefix.js']
        .concat(legacyFilesToAppend)
        .concat('vendor/addons.js')
        .concat('vendor/ember-cli/vendor-suffix.js');

    var vendor = this.concatFiles(applicationJs, {
        inputFiles: inputFiles,
        outputFile: this.options.outputPaths.vendor.js,
        separator: EOL + ';',
        annotation: 'Concat: Vendor'
    });


    var bundleFiles = Object.keys(this.bundleCofig).map(function(key){
        var bundle = this.bundleCofig[key];
        bundle["name"] = key;

        var bundleJS = new Funnel(AllAppJs, {
            include: bundle.files,
            getDestinationPath: function(relativePath) {
                return relativePath;
            }
        });
        return {config: bundle, tree: bundleJS};
    },this).map(function(bundleTree){

        return this.concatFiles(bundleTree.tree, {
            inputFiles: [this.name + '/**/*.js'],
            outputFile: appOutputPath.replace(".js", "."+bundleTree.config.name.toLowerCase() + ".bundle.js") ,
            annotation: 'Concat: App-Index'
        });
    },this);



    appJs = this.concatFiles(appJs, {
        inputFiles: [this.name + '/**/*.js'],
        headerFiles: [
            'vendor/ember-cli/app-prefix.js'
        ],
        footerFiles: [
            'vendor/ember-cli/app-suffix.js',
            'vendor/ember-cli/app-boot.js'
        ],
        outputFile: appOutputPath,
        annotation: 'Concat: App'
    });



    var emberFiles = [
        vendor,
        appJs
    ].concat(bundleFiles);

    return mergeTrees(emberFiles, {
        annotation: 'TreeMerger (vendor & appJS)'
    });
}




module.exports =  EmberAppBundle;