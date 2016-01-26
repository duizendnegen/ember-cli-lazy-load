/**
 * ES6 not supported here
 */
import Ember from "ember";
import config from 'ember-get-config';

export default Ember.Mixin.create({
    bundleLoader: Ember.inject.service("bundle-loader"),

    findBundleNameByRoute: function(routeName){
        //Find bundle for route
        var bundleName = null;
        var bundleNames = Object.keys(config.bundles);
        bundleNames.forEach(function(name) {
          var bundle = config.bundles[name];
          if(bundle.routes.indexOf(routeName) >= 0) {
            bundleName = name;
          }
        });

        return bundleName;

    },
    beforeModel: function(transition, queryParams){
        this._super(transition,queryParams);
        let service = this.get("bundleLoader");
        let bundleName = this.findBundleNameByRoute(transition.targetName);

        return service.loadBundle(bundleName);
    }

});
