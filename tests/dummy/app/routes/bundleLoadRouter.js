import Ember from "ember";
import Router from "./../router";

export default Ember.Route.extend({

    beforeModel: function(trans) {
        return Router.beforeModel(trans);
    }

});