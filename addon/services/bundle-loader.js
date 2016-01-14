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
        if(typeof config.bundles === "undefined" && config.enviroment==="development"){
            console.warn("please specify a bundles option in your enviroment config");
            return;
        }


        let jsonStr = Ember.$(document.getElementsByName("ember-asset-map")).attr("content");
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

        if (typeof  this._promises[name] === "undefined") {

            this._promises[name] = this.getScript(config.bundles[name].url);

        } else {
            return this._promises[name];
        }
    },
    loadBundle:function(routeName){
        //Find bundle for route
        var foundBundleName  = Object.keys(config.bundles)
            .find((name)=> {
                let bundle = config.bundles[name];
                return bundle.routes.indexOf(routeName)>-1;
            });

        if( typeof foundBundleName === "undefined"){
            return new Promise((resolve)=>resolve());
        }

        //find dependencies
        var dependencies = typeof config.bundles[foundBundleName].dependencies !== "undefined" ? config.bundles[foundBundleName].dependencies: [];

        //Load all dependencies bundles and the actual bundle
        dependencies.push(foundBundleName);

        var requests = dependencies.map((depName)=>this.requireBundle(depName));

        return Ember.$.when(requests);
    }

});