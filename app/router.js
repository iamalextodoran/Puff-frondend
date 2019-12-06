import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('overview');
  this.route('incomes');
  this.route('expenses');
  this.route('settings');
  this.route('users');
});

export default Router;
