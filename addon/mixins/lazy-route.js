/**
 * ES6 not supported here
 */
import Ember from "ember";
import config from 'ember-get-config';

export default Ember.Mixin.create({

    bundleLoader: Ember.inject.service("bundle-loader"),

    findBundleNameByRoute: function(routeName){
        //Find bundle for route
        var foundBundleName  = Object.keys(config.bundles)
            .find((name)=> {
                let bundle = config.bundles[name];
                return bundle.routes.indexOf(routeName)>-1;
            });
        return foundBundleName;

    },
    beforeModel: function(transition, queryParams){
        this._super(transition,queryParams);
        let service = this.get("bundleLoader");
        let bundleName = this.findBundleNameByRoute(transition.targetName);

        return service.loadBundle(bundleName);
    }

});