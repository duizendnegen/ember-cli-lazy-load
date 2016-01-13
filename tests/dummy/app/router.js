import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('about',{ path: '/about' });
  this.route('cats',{ path: '/cats' });
  this.route('index',{ path: '/' });

});
export default Router;
