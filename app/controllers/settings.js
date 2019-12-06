import Controller from '@ember/controller';
import { computed } from "@ember/object";

export default Controller.extend({
  
  darkModeToggle: false,
  accentColorToggle: true,
  carryOverEnabled: true,
  currencyToggle:false,
  
  
  users: computed(function() {
    return this.get('store').findAll('user');
  }),

  actions: {
    goToUser: function() {
    },
    darkModeToggle: function() {
      this.set('darkModeToggle', true);
    }
  }
});