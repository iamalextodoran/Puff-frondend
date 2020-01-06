import Controller from '@ember/controller';
import { computed } from "@ember/object";

export default Controller.extend({
  accentColorToggle: true,
  carryOverEnabled: true,
  currencyToggle:false,
  
  users: computed(function() {
    return this.get('store').findAll('user');
  }),

  currentUserDarkMode: computed(function() {
    return this.get('store').findRecord('user', 42).get('darkMode');
  }),

  actions: {
    goToUser: function() {

    },

    darkModeToggle: function() {
      return this.store.findRecord('user', 42).then(function(user) {
        user.darkMode = true;
    
        user.save();
      });
    }
  }
});