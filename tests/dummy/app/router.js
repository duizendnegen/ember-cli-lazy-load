import Ember from 'ember';
import config from './config/environment';


const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('about',{ path: '/about' });
  this.route('index',{ path: '/' });

});
Router._bundlePromises = {};


/**
 *
 * Instand of Ember.$.getScript because the getScript function is async see: http://stackoverflow.com/questions/1130921/is-the-callback-on-jquerys-getscript-unreliable-or-am-i-doing-something-wrong
 * @param url
 * @returns {Ember.$.Promise}
 * @private
 */
Router._getScript = function(url){
  return Ember.$.ajax({
    url: url,
    dataType: 'script',
    async: false
  });
};

/**
 * Load a bundle or return the promise of the bundle if already loaded / loading
 * @param name
 * @returns {*}
 * @private
 */
Router._loadBundle = function (name){

  if(typeof  Router._bundlePromises[name]  === "undefined"){
    Router._bundlePromises[name] = Router._getScript('/assets/'+config.modulePrefix + "-" +name.toLowerCase()+'.js');
  }else {
    return Router._bundlePromises[name];
  }
};

/**
 * Excecuted by each route that extends the bundleLoadRouter
 * @param transition
 * @returns {Promise}
 */
Router.beforeModel= function(transition){

  //Find bundle for route
  var rightBundleForRoute  = Object.keys(config.bundles)
                                    .find((name)=> {
                                      let bundle = config.bundles[name];
                                      return bundle.routes.indexOf(transition.targetName)>-1;
                                    });

  if( typeof rightBundleForRoute === "undefined"){
    return true;
  }

  //find dependencies
  var dependencies = typeof rightBundleForRoute.dependencies !== "undefined" ? rightBundleForRoute.dependencies: [];


  //Load all dependencies bundles and the actual bundle
  dependencies.push(rightBundleForRoute.name);

  var requests = dependencies.map((depName)=>Router._loadBundle(depName));

  return Ember.$.when(requests);


};
export default Router;
