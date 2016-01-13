import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('about',{ path: '/about' });
  this.route('index',{ path: '/' });

});
/**
 * Excecuted by each route that extends the bundleLoadRouter
 * @param transition
 * @returns {Promise}
 */
Router.beforeModel= function(transition){




};
export default Router;
