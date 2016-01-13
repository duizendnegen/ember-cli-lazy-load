/**
 * ES6 not supported here
 */
import Ember from "ember";

export default Ember.Mixin.create({

    bundles: Ember.inject.service(),

    beforeModel: function(transition, queryParams){
        this._super(transition,queryParams);
        let service = this.get("bundle-loader");
        return service.loadBundle(transition.targetName);
    }

});