/* jshint node: true */
'use strict';

var Funnel      = require('broccoli-funnel');
var treeJson    = require("broccoli-tree-to-json");
var MergeTrees       = require("broccoli-merge-trees")
module.exports = {
  name: 'ember-cli-bundle',

  included: function(app, parentAddon) {
    var target = (parentAddon || app);

    // Now you can modify the app / parentAddon. For example, if you wanted
    // to include a custom preprocessor, you could add it to the target's
    // registry:
    //

    var options;
    //shortcut for disable this
    if(this.app.options.bundles === false){
        options = false;
    }else {
      options = this.app.options.bundles = this.app.options.bundles || {};
    }

  },
  contentFor: function(type,config){
    console.log(type,config)
    if (type === 'head-footer') {
      return '<meta name="ember-asset-map" content="@assetMap"/>';
    }
  },
  postprocessTree:function(type,tree){
    var workingTree = tree;


    var indexTree = replace(workingTree, {
      files: [
        '**/*.html' // replace only html files in src
      ],
      patterns: [
        {
          match: 'assetMap',
          replacement: 'bar'
        }
      ]
    });

    var mergedTree = new MergeTrees([workingTree,indexTree], {
      overwrite: true
    });
    return new Funnel(mergedTree, {
      getDestinationPath: function(relativePath) {
        console.log(type,relativePath);
        return relativePath;
      }
    });;
  }
};
