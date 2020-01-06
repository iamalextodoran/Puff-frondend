/* eslint-disable ember/use-brace-expansion */
import Controller from '@ember/controller';
import { computed } from "@ember/object";

export default Controller.extend({
  accentColorToggle: true,
  carryOverEnabled: true,
  currencyToggle:false,
  currentUser: 42,
  dangerValue: 1000,
  
  users: computed(function() {
    return this.get('store').findAll('user');
  }),

  userNames: computed('users', function() {
    return this.get('users.fullName')
  }),

  actions: {
    goToUser: function() {

    },
    userState: function() {

    },

    darkModeToggle: function() {
      return this.store.findRecord('user', 42).then(function(user) {
        user.darkMode = true;
    
        user.save();
      });
    }
  }
});