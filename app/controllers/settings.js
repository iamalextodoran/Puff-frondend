import Controller from '@ember/controller';
import { computed } from "@ember/object";

export default Controller.extend({
  accentColorToggle: true,
  carryOverEnabled: true,
  currencyToggle:false,
  
  darkModeToggle: false,
  
  users: computed(function() {
    return this.get('store').findAll('user');
  }),

  actions: {
    goToUser: function() {

    },

    darkModeToggle: function() {
      
    }
  }
});