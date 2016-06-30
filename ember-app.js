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
    var deprecate           = this.project.ui.writeDeprecateLine.bind(this.project.ui);
    var applicationJs       = this.appAndDependencies();
    var appOutputPath       = this.options.outputPaths.app.js;
    var appJs               = applicationJs;

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

    var bundleFiles = Object.keys(this.bundleCofig)
        .filter(function(key){
            var bundle = this.bundleCofig[key];
            if(bundle && bundle.files && bundle.files.length > 0){
                return true
            }
        },this)
        .map(function(key){
        var bundle = this.bundleCofig[key];
        bundle["name"] = key;

        var bundleJS = new Funnel(applicationJs, {
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

    /**
     * Exclude the bundle files from the main file
     * #
     */
    var excludedFiles  = Object.keys(this.bundleCofig).map(function(key){
        return this.bundleCofig[key].files;
    },this);

    //Flattern array
    excludedFiles = [].concat.apply([],excludedFiles);

    appJs = new Funnel(applicationJs, {
        exclude: excludedFiles,
        getDestinationPath: function(relativePath) {
            return relativePath;
        }
    });

    appJs = mergeTrees([
        appJs,
        this._processedEmberCLITree()
    ], {
        annotation: 'TreeMerger (appJS  & processedEmberCLITree)',
        overwrite: true
    });

    appJs = this.concatFiles(appJs, {
        inputFiles: [this.name + '/**/*.js'],
        headerFiles: [
            'vendor/ember-cli/app-prefix.js'
        ],
        footerFiles: [
            'vendor/ember-cli/app-suffix.js',
            'vendor/ember-cli/app-config.js',
            'vendor/ember-cli/app-boot.js'
        ],
        outputFile: appOutputPath,
        annotation: 'Concat: App'
    });

    if (this.legacyFilesToAppend.length > 0) {
      deprecate('Usage of EmberApp.legacyFilesToAppend is deprecated. Please use EmberApp.import instead for the following files: \'' + this.legacyFilesToAppend.join('\', \'') + '\'');
      this.legacyFilesToAppend.forEach(function(legacyFile) {
        this.import(legacyFile);
      }.bind(this));
    }

    this.import('vendor/ember-cli/vendor-prefix.js', {prepend: true});
    this.import('vendor/addons.js');
    this.import('vendor/ember-cli/vendor-suffix.js');

    var vendorFiles = [];
    for (var outputFile in this._scriptOutputFiles) {
      var inputFiles = this._scriptOutputFiles[outputFile];

      vendorFiles.push(
        this.concatFiles(applicationJs, {
          inputFiles: inputFiles,
          outputFile: outputFile,
          separator: EOL + ';',
          annotation: 'Concat: Vendor ' + outputFile
        })
      );
    }

    return mergeTrees(vendorFiles.concat(appJs).concat(bundleFiles), {
        annotation: 'TreeMerger (vendor & appJS)'
    });
}

module.exports =  EmberAppBundle;
