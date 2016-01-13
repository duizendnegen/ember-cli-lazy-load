import  Ember from "ember"

export default Ember.Service.extend({

    /**
     * bundles with the promises
     */
    _promises: {},

    /**
     * asset map
     */
    _config: false,

    /**
     * Init function
     */
    init: function(){
        if(document){
            let jsonStr = Ember.$(document.getElementsByName("ember-asset-map")).attr("content").replace(/'/g,'"');
            this._bundleUrlMap = JSON.parse(jsonStr);
        }
        var applicationConfig = this.container.lookup('config:environment');
        console.log(applicationConfig.modulePrefix)
        this._super();
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
     * Get the url for a given bundle name
     * @param name - the name of the bundle
     * @returns {*}
     */
    getUrlByName: function (name) {

        if(typeof this._bundleUrlMap[name] != "undefined") {
            return this._bundleUrlMap[name];
        }
        else {
            return '/assets/' + config.modulePrefix + "." + name.toLowerCase() + '.bundle.js';
        }

    },
    /**
     * Load a bundle or return the promise of the bundle if already loaded / loading
     * @param name
     * @returns {*}
     * @private
     */
    requireBundle: function (name) {

        if (typeof  this._bundlePromises[name] === "undefined") {

            this._bundlePromises[name] = this.getScript(this.getUrlByName(name));

        } else {
            return this._bundlePromises[name];
        }
    },
    loadBundle:function(routeName){
        //Find bundle for route
        var rightBundleForRoute  = Object.keys(this.config)
            .find((name)=> {
                let bundle = this.config[name];
                return bundle.routes.indexOf(routeName)>-1;
            });

        if( typeof rightBundleForRoute === "undefined"){
            return new Promise((resolve)=>resolve());
        }

        //find dependencies
        var dependencies = typeof rightBundleForRoute.dependencies !== "undefined" ? rightBundleForRoute.dependencies: [];


        //Load all dependencies bundles and the actual bundle
        dependencies.push(rightBundleForRoute.name);

        var requests = dependencies.map((depName)=>Router._loadBundle(depName));

        return Ember.$.when(requests);
    }

});