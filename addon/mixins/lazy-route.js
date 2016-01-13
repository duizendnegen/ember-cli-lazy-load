/**
 * ES6 not supported here
 */
import Ember from "ember";

export default Ember.Mixin.create({

    bundleLoader: Ember.inject.service("bundle-loader"),

    beforeModel: function(transition, queryParams){
        this._super(transition,queryParams);
        let service = this.get("bundleLoader");
        return service.loadBundle(transition.targetName);
    }

});