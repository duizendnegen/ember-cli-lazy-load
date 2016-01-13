/**
 * ES6 not supported here
 */
import Ember from "ember";

export default Ember.Mixin.create({

    bundles: Ember.inject.service(),

    /*
    init(){
        let service = this.get("bundles")
        console.log(this.bundles.loadBundle());
        this._super();
    },*/

    beforeModel: function(transition, queryParams){
        console.log("lazy-route:beforeModel");
        let service = this.get("bundles");
        return service.loadBundle(transition.targetName);
    }

});