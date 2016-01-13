import Ember from "ember"
import LazyRouteMixin from 'ember-cli-bundle/mixins/lazy-route';
export default Ember.Route.extend(LazyRouteMixin,{

    beforeModel: function(transition, queryParams){
        return this._super(transition,queryParams).then(()=>{

            console.log("before")
        });
    }
});