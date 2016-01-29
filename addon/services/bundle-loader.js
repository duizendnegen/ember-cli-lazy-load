import  Ember from "ember";
import config from 'ember-get-config';
export default Ember.Service.extend({

    /**
     * bundles with the promises
     */
    _promises: {},


    /**
     * Init function
     */
    init: function(){
        this._modifyConfig();
        this._super();
    },

    _modifyConfig(){
        if(!config.bundles && config.enviroment==="development"){
            console.warn("please specify a bundles option in your enviroment config");
            return;
        }


        let jsonStr = Ember.$("meta[name='ember-asset-map']").attr("content");
        jsonStr = decodeURIComponent(jsonStr);
        let jsonObj = JSON.parse(jsonStr);
        let bundleMapKey   = Object.keys(jsonObj);

        Object.keys(config.bundles).forEach((key)=>{
            if(bundleMapKey.indexOf(key) > -1){
                config.bundles[key].url = jsonObj[key];
            }else {
                return '/assets/' + config.modulePrefix + "." + key + '.bundle.js';
            }
        });

    },
    /**
     *
     * Instand of Ember.$.getScript because the getScript function is async see: http://stackoverflow.com/questions/1130921/is-the-callback-on-jquerys-getscript-unreliable-or-am-i-doing-something-wrong
     * @param url
     * @returns {Ember.$.Promise}
     * @private
     */
    getScript: function (url) {
        return Ember.$.ajax({
            url: url,
            dataType: 'script',
            async: false
        });
    },

    /**
     * Load a bundle or return the promise of the bundle if already loaded / loading
     * @param name
     * @returns {*}
     * @private
     */
    requireBundle: function (name) {
      if (!this._promises[name]) {
        this._promises[name] = this.getScript(config.bundles[name].url);
      } else {
        return this._promises[name];
      }
    },

    /* jshint ignore:start */
    loadBundle: function(bundleName) {
      if(!bundleName) {
        return new Promise((resolve)=>resolve());
      }

      var dependencies = this.findDependencies(config.bundles[bundleName]);
      if(dependencies.indexOf(bundleName) === -1) {
        dependencies.push(bundleName);
      }

      var requests = dependencies.map((dependencyName) => this.requireBundle(dependencyName));

      return Ember.$.when(requests);
    },
    /* jshint ignore:end */

    findDependencies: function(bundle) {
      var allDependencies = [];

      if(!bundle) {
        return allDependencies;
      }

      // find dependencies
      var directDependencies = (!!bundle.dependencies) ? bundle.dependencies : [];
      directDependencies.forEach((dependency) => {
        var nestedDependencies = this.findDependencies(config.bundles[dependency]);

        nestedDependencies.forEach((nestedDependency) => {
          if(allDependencies.indexOf(nestedDependency) === -1) {
            allDependencies.push(nestedDependency);
          }
        });

        if(allDependencies.indexOf(dependency) === -1) {
          allDependencies.push(dependency);
        }
      });

      return allDependencies;
    }
});
